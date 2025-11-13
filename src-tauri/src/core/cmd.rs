use tauri::{command, AppHandle, LogicalPosition, Manager, PhysicalSize};
use std::process::Command;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::time::{SystemTime, UNIX_EPOCH};
use regex::Regex;

use crate::core::{
    conf::AppConf,
    constant::{ASK_HEIGHT, TITLEBAR_HEIGHT},
};

#[command]
pub fn view_reload(app: AppHandle) {
    app.get_window("core")
        .unwrap()
        .get_webview("main")
        .unwrap()
        .eval("window.location.reload()")
        .unwrap();
}

#[command]
pub fn view_url(app: AppHandle) -> tauri::Url {
    app.get_window("core")
        .unwrap()
        .get_webview("main")
        .unwrap()
        .url()
        .unwrap()
}

#[command]
pub fn view_go_forward(app: AppHandle) {
    app.get_window("core")
        .unwrap()
        .get_webview("main")
        .unwrap()
        .eval("window.history.forward()")
        .unwrap();
}

#[command]
pub fn view_go_back(app: AppHandle) {
    app.get_window("core")
        .unwrap()
        .get_webview("main")
        .unwrap()
        .eval("window.history.back()")
        .unwrap();
}

#[command]
pub fn window_pin(app: AppHandle, pin: bool) {
    let conf = AppConf::load(&app).unwrap();
    conf.amend(serde_json::json!({"stay_on_top": pin}))
        .unwrap()
        .save(&app)
        .unwrap();

    app.get_window("core")
        .unwrap()
        .set_always_on_top(pin)
        .unwrap();
}

#[command]
pub fn ask_sync(app: AppHandle, message: String) {
    app.get_window("core")
        .unwrap()
        .get_webview("main")
        .unwrap()
        .eval(&format!("ChatAsk.sync({})", message))
        .unwrap();
}

#[command]
pub fn ask_send(app: AppHandle) {
    let win = app.get_window("core").unwrap();

    win.get_webview("main")
        .unwrap()
        .eval(
            r#"
        ChatAsk.submit();
        setTimeout(() => {
            __TAURI__.webview.Webview.getByLabel('ask')?.setFocus();
        }, 500);
        "#,
        )
        .unwrap();
}

#[command]
pub fn set_theme(app: AppHandle, theme: String) {
    let conf = AppConf::load(&app).unwrap();
    conf.amend(serde_json::json!({"theme": theme}))
        .unwrap()
        .save(&app)
        .unwrap();

    app.restart();
}

#[command]
pub fn get_app_conf(app: AppHandle) -> AppConf {
    AppConf::load(&app).unwrap()
}

#[command]
pub fn set_tts_pref(app: AppHandle, voice_name: Option<String>, voice_lang: Option<String>, auto: bool) {
    let conf = AppConf::load(&app).unwrap();
    let new = serde_json::json!({"tts_voice_name": voice_name, "tts_voice_lang": voice_lang, "tts_auto": auto});
    conf.amend(new).unwrap().save(&app).unwrap();
}

#[command]
pub fn set_visual_preset(app: AppHandle, preset: Option<String>) {
    let conf = AppConf::load(&app).unwrap();
    let new = serde_json::json!({"visual_preset": preset});
    conf.amend(new).unwrap().save(&app).unwrap();
}

#[command]
pub fn get_approved_apps(app: AppHandle) -> Vec<String> {
    let conf = AppConf::load(&app).unwrap();
    conf.approved_apps.clone()
}

#[command]
pub fn add_approved_app(app: AppHandle, key: String) -> Result<Vec<String>, String> {
    let conf = AppConf::load(&app).map_err(|e| format!("load conf: {}", e))?;
    let mut apps = conf.approved_apps.clone();
    if !apps.contains(&key) {
        apps.push(key.clone());
    }
    let new = serde_json::json!({"approved_apps": apps});
    conf.amend(new).map_err(|e| format!("amend: {}", e))?.save(&app).map_err(|e| format!("save: {}", e))?;
    Ok(AppConf::load(&app).unwrap().approved_apps)
}

#[command]
pub fn remove_approved_app(app: AppHandle, key: String) -> Result<Vec<String>, String> {
    let conf = AppConf::load(&app).map_err(|e| format!("load conf: {}", e))?;
    let mut apps = conf.approved_apps.clone();
    apps.retain(|a| a != &key);
    let new = serde_json::json!({"approved_apps": apps});
    conf.amend(new).map_err(|e| format!("amend: {}", e))?.save(&app).map_err(|e| format!("save: {}", e))?;
    Ok(AppConf::load(&app).unwrap().approved_apps)
}

fn append_audit(app: &AppHandle, entry: &str) {
    if let Ok(path) = AppConf::get_conf_path(app) {
        if let Some(dir) = path.parent() {
            let _ = fs::create_dir_all(dir);
            let logpath = dir.join("audit.log");
            if let Ok(mut f) = OpenOptions::new().create(true).append(true).open(&logpath) {
                let ts = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_secs()).unwrap_or(0);
                let _ = writeln!(f, "{} | {}", ts, entry);
            }
        }
    }
}

#[command]
pub fn get_approved_scripts(app: AppHandle) -> Result<Vec<String>, String> {
    let scripts_dir = AppConf::get_scripts_path(&app).map_err(|e| format!("scripts path: {}", e))?.join("approved");
    if !scripts_dir.exists() {
        return Ok(vec![]);
    }
    let mut out = vec![];
    for entry in fs::read_dir(scripts_dir).map_err(|e| format!("read_dir: {}", e))? {
        let e = entry.map_err(|e| format!("entry: {}", e))?;
        if let Some(name) = e.file_name().to_str() {
            out.push(name.to_string());
        }
    }
    Ok(out)
}

#[command]
pub fn run_approved_script(app: AppHandle, filename: String) -> Result<String, String> {
    let scripts_dir = AppConf::get_scripts_path(&app).map_err(|e| format!("scripts path: {}", e))?.join("approved");
    let file_path = scripts_dir.join(&filename);
    if !file_path.exists() {
        let msg = format!("script not found: {}", filename);
        append_audit(&app, &format!("run_script:{} => {}", filename, msg));
        return Err(msg);
    }

    #[cfg(target_os = "windows")]
    {
        // decide runner by extension
        let ext = file_path.extension().and_then(|s| s.to_str()).unwrap_or("");
        let spawn_res = match ext.to_lowercase().as_str() {
            "ps1" => Command::new("powershell").arg("-ExecutionPolicy").arg("Bypass").arg("-File").arg(file_path.clone()).spawn(),
            "bat" | "cmd" => Command::new(file_path.clone()).spawn(),
            "exe" => Command::new(file_path.clone()).spawn(),
            _ => Command::new("powershell").arg("-ExecutionPolicy").arg("Bypass").arg("-File").arg(file_path.clone()).spawn(),
        };

        match spawn_res {
            Ok(_) => {
                append_audit(&app, &format!("run_script:{} => launched", filename));
                Ok(format!("launched {}", filename))
            }
            Err(e) => {
                append_audit(&app, &format!("run_script:{} => err:{}", filename, e));
                Err(format!("failed to run {}: {}", filename, e))
            }
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        Err("script runner is only implemented for Windows".to_string())
    }
}

#[command]
pub fn submit_learning(app: AppHandle, name: String, command: String) -> Result<Vec<serde_json::Value>, String> {
    let conf = AppConf::load(&app).map_err(|e| format!("load conf: {}", e))?;
    let mut learnings = conf.pending_learnings.clone();
    
    // Create a learning entry with timestamp
    let entry = serde_json::json!({
        "name": name,
        "command": command,
        "timestamp": SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_secs()).unwrap_or(0),
    });
    
    learnings.push(entry);
    let new = serde_json::json!({"pending_learnings": learnings});
    conf.amend(new).map_err(|e| format!("amend: {}", e))?.save(&app).map_err(|e| format!("save: {}", e))?;
    
    append_audit(&app, &format!("learning_submitted: {}", name));
    Ok(AppConf::load(&app).unwrap().pending_learnings)
}

#[command]
pub fn get_pending_learnings(app: AppHandle) -> Result<Vec<serde_json::Value>, String> {
    let conf = AppConf::load(&app).map_err(|e| format!("load conf: {}", e))?;
    Ok(conf.pending_learnings.clone())
}

#[command]
pub fn approve_learning(app: AppHandle, name: String) -> Result<Vec<String>, String> {
    let conf = AppConf::load(&app).map_err(|e| format!("load conf: {}", e))?;
    
    // Find and remove from pending
    let mut learnings = conf.pending_learnings.clone();
    let mut command = None;
    learnings.retain(|item| {
        if item.get("name").and_then(|v| v.as_str()) == Some(&name) {
            command = item.get("command").and_then(|v| v.as_str()).map(|s| s.to_string());
            false // remove it
        } else {
            true
        }
    });
    
    // Add command to approved_apps if found
    let mut apps = conf.approved_apps.clone();
    if let Some(cmd) = command {
        if !apps.contains(&cmd) {
            apps.push(cmd);
        }
    }
    
    let new = serde_json::json!({"pending_learnings": learnings, "approved_apps": apps});
    conf.amend(new).map_err(|e| format!("amend: {}", e))?.save(&app).map_err(|e| format!("save: {}", e))?;
    
    append_audit(&app, &format!("learning_approved: {}", name));
    Ok(AppConf::load(&app).unwrap().approved_apps)
}

#[command]
pub fn reject_learning(app: AppHandle, name: String) -> Result<Vec<serde_json::Value>, String> {
    let conf = AppConf::load(&app).map_err(|e| format!("load conf: {}", e))?;
    
    // Remove from pending
    let mut learnings = conf.pending_learnings.clone();
    learnings.retain(|item| {
        item.get("name").and_then(|v| v.as_str()) != Some(&name)
    });
    
    let new = serde_json::json!({"pending_learnings": learnings});
    conf.amend(new).map_err(|e| format!("amend: {}", e))?.save(&app).map_err(|e| format!("save: {}", e))?;
    
    append_audit(&app, &format!("learning_rejected: {}", name));
    Ok(AppConf::load(&app).unwrap().pending_learnings)
}

#[command]
pub fn extract_youtube_info(url: String) -> Result<serde_json::Value, String> {
    // Extract video ID from various YouTube URL formats
    let video_id = if let Some(caps) = Regex::new(r"(?:youtube\.com/watch\?v=|youtu\.be/)([A-Za-z0-9_-]{11})")
        .unwrap()
        .captures(&url)
    {
        caps.get(1).map(|m| m.as_str()).unwrap_or("")
    } else {
        return Err("Invalid YouTube URL".to_string());
    };

    if video_id.is_empty() {
        return Err("Could not extract video ID".to_string());
    }

    // Return extracted info object with video ID (further processing can be done client-side or via API)
    // For now, we'll return basic info that the frontend can use to display/process
    let info = serde_json::json!({
        "video_id": video_id,
        "url": url,
        "source": "youtube",
        "title": format!("YouTube Video: {}", video_id),
        "note": "Paste the video ID or URL; content extraction may require additional setup (e.g., yt-dlp or YouTube API key)"
    });

    Ok(info)
}

#[command]
pub fn run_approved_app(app: AppHandle, action: String) -> Result<String, String> {
    // Load config to ensure action is approved
    let conf = AppConf::load(&app).map_err(|e| format!("failed load conf: {}", e))?;
    if !conf.approved_apps.contains(&action) {
        return Err(format!("action not approved: {}", action));
    }

    // Map action keys to safe commands
    let res = match action.as_str() {
        "notepad" => Command::new("notepad").spawn(),
        "calculator" | "calc" | "calculator" => Command::new("calc").spawn(),
        "explorer" => Command::new("explorer").spawn(),
        other => {
            return Err(format!("unknown approved action: {}", other));
        }
    };

    match res {
        Ok(_) => Ok(format!("launched {}", action)),
        Err(e) => Err(format!("failed to launch {}: {}", action, e)),
    }
}

#[command]
pub fn set_view_ask(app: AppHandle, enabled: bool) {
    let conf = AppConf::load(&app).unwrap();
    conf.amend(serde_json::json!({"ask_mode": enabled}))
        .unwrap()
        .save(&app)
        .unwrap();

    let core_window = app.get_window("core").unwrap();
    let ask_mode_height = if enabled { ASK_HEIGHT } else { 0.0 };
    let scale_factor = core_window.scale_factor().unwrap();
    let titlebar_height = (scale_factor * TITLEBAR_HEIGHT).round() as u32;
    let win_size = core_window.inner_size().unwrap();
    let ask_height = (scale_factor * ask_mode_height).round() as u32;

    let main_view = core_window.get_webview("main").unwrap();
    let titlebar_view = core_window.get_webview("titlebar").unwrap();
    let ask_view = core_window.get_webview("ask").unwrap();

    if enabled {
        ask_view.set_focus().unwrap();
    } else {
        main_view.set_focus().unwrap();
    }

    let set_view_properties =
        |view: &tauri::Webview, position: LogicalPosition<f64>, size: PhysicalSize<u32>| {
            if let Err(e) = view.set_position(position) {
                eprintln!("[cmd:view:position] Failed to set view position: {}", e);
            }
            if let Err(e) = view.set_size(size) {
                eprintln!("[cmd:view:size] Failed to set view size: {}", e);
            }
        };

    #[cfg(target_os = "macos")]
    {
        set_view_properties(
            &main_view,
            LogicalPosition::new(0.0, TITLEBAR_HEIGHT),
            PhysicalSize::new(
                win_size.width,
                win_size.height - (titlebar_height + ask_height),
            ),
        );
        set_view_properties(
            &titlebar_view,
            LogicalPosition::new(0.0, 0.0),
            PhysicalSize::new(win_size.width, titlebar_height),
        );
        set_view_properties(
            &ask_view,
            LogicalPosition::new(
                0.0,
                (win_size.height as f64 / scale_factor) - ask_mode_height,
            ),
            PhysicalSize::new(win_size.width, ask_height),
        );
    }

    #[cfg(not(target_os = "macos"))]
    {
        set_view_properties(
            &main_view,
            LogicalPosition::new(0.0, 0.0),
            PhysicalSize::new(
                win_size.width,
                win_size.height - (ask_height + titlebar_height),
            ),
        );
        set_view_properties(
            &titlebar_view,
            LogicalPosition::new(
                0.0,
                (win_size.height as f64 / scale_factor) - TITLEBAR_HEIGHT,
            ),
            PhysicalSize::new(win_size.width, titlebar_height),
        );
        set_view_properties(
            &ask_view,
            LogicalPosition::new(
                0.0,
                (win_size.height as f64 / scale_factor) - ask_mode_height - TITLEBAR_HEIGHT,
            ),
            PhysicalSize::new(win_size.width, ask_height),
        );
    }
}
