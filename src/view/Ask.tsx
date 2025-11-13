import React, { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useHotkeys } from 'react-hotkeys-hook';
import useInfo from '~hooks/useInfo';
import SendIcon from '~icons/Send';
import Avatar from '~components/Avatar';
import debounce from 'lodash/debounce';

export default function ChatInput() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  const { isMac } = useInfo();
  // Text-to-speech state
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIndex, setVoiceIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [approvedApps, setApprovedApps] = useState<string[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [pendingLearnings, setPendingLearnings] = useState<any[]>([]);
  const [learningName, setLearningName] = useState('');
  const [learningCommand, setLearningCommand] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isListening, setIsListening] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [ttsPreset, setTtsPreset] = useState<'default' | 'energetic-hero' | 'supersain'>('default');
  const [visualEnabled, setVisualEnabled] = useState(false);
  // Hold persisted voice info until voices are available
  const persistedVoiceRef = useRef<{ name: string | null; lang: string | null } | null>(null);

  useEffect(() => {
    const syncMessage = debounce(async () => {
      try {
        await invoke('ask_sync', { message: JSON.stringify(message) });
      } catch (error) {
        console.error('Error syncing message:', error);
      }
    }, 300); // Debounce by 300ms

    syncMessage();
    return () => syncMessage.cancel(); // Cleanup debounce on unmount
  }, [message]);

  // Load available voices for speechSynthesis
  useEffect(() => {
    const synth = (window as any).speechSynthesis;
    if (!synth) return;

    const loadVoices = () => {
      const available = synth.getVoices() || [];
      setVoices(available);
      // If there was a persisted voice name/lang, try to find and apply it
      const persisted = persistedVoiceRef.current;
      if (persisted && (persisted.name || persisted.lang)) {
        const idx = available.findIndex((v: SpeechSynthesisVoice) => {
          if (persisted.name && persisted.lang) return v.name === persisted.name && v.lang === persisted.lang;
          if (persisted.name) return v.name === persisted.name;
          return persisted.lang ? v.lang === persisted.lang : false;
        });
        if (idx !== -1) {
          setVoiceIndex(idx);
          return;
        }
      }

      if (available.length > 0 && voiceIndex === null) setVoiceIndex(0);
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;
    return () => {
      try {
        synth.onvoiceschanged = null;
      } catch {}
    };
  }, [voiceIndex]);

  // Load persisted prefs from backend
  useEffect(() => {
    (async () => {
      try {
        const conf: any = await invoke('get_app_conf');
        if (conf) {
          // backend persists voice by name/lang (tts_voice_name, tts_voice_lang)
          // store it in a ref and apply when voices are loaded
          if (conf.tts_voice_name || conf.tts_voice_lang) {
            persistedVoiceRef.current = {
              name: conf.tts_voice_name || null,
              lang: conf.tts_voice_lang || null,
            };
          }
          if (typeof conf.tts_auto === 'boolean') setAutoSpeak(conf.tts_auto);
          // visual preset persisted in backend (visual_preset)
          if (conf.visual_preset && typeof conf.visual_preset === 'string') {
            setTtsPreset(conf.visual_preset as any);
            setVisualEnabled(conf.visual_preset === 'supersain');
          }
          // load approved apps list
          try {
            const apps: string[] = await invoke('get_approved_apps');
            setApprovedApps(apps || []);
            if (apps && apps.length > 0) setSelectedApp(apps[0]);
          } catch {}
          // load pending learnings
          try {
            const learnings: any[] = await invoke('get_pending_learnings');
            setPendingLearnings(learnings || []);
          } catch {}
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const speak = (text: string) => {
    const synth = (window as any).speechSynthesis;
    if (!synth || !text) return;
    // Stop existing
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    if (voiceIndex !== null && voices[voiceIndex]) {
      utt.voice = voices[voiceIndex];
    }
    // Apply simple preset adjustments (stylistic only). This is NOT an attempt
    // to clone or impersonate any specific character or actor. It produces a
    // stylized timbre by adjusting pitch/rate/volume.
    if (ttsPreset === 'energetic-hero') {
      utt.pitch = 1.5; // higher pitch
      utt.rate = 1.15; // slightly faster
      utt.volume = 1.0; // full volume
    } else if (ttsPreset === 'supersain') {
      // supersain: brighter, punchier, with a stronger presence
      utt.pitch = 1.6;
      utt.rate = 1.2;
      utt.volume = 1.0;
    } else {
      // defaults are browser-provided (usually pitch=1, rate=1)
      utt.pitch = 1.0;
      utt.rate = 1.0;
      utt.volume = 1.0;
    }
    utteranceRef.current = utt;
    setIsSpeaking(true);
    utt.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    utt.onerror = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    synth.speak(utt);
  };

  const stopSpeaking = () => {
    const synth = (window as any).speechSynthesis;
    if (!synth) return;
    synth.cancel();
    setIsSpeaking(false);
    utteranceRef.current = null;
  };

  useHotkeys(isMac ? 'meta+enter' : 'ctrl+enter', async (event: KeyboardEvent) => {
    event.preventDefault();
    await handleSend();
  }, {
    enableOnFormTags: true,
  }, [message]);

  // Keyboard shortcuts for TTS: Alt+S to speak, Alt+Shift+S to stop
  useHotkeys('alt+s', (event: KeyboardEvent) => {
    event.preventDefault();
    if (message) speak(message);
  }, { enableOnFormTags: true }, [message, voiceIndex, voices]);

  useHotkeys('alt+shift+s', (event: KeyboardEvent) => {
    event.preventDefault();
    stopSpeaking();
  }, { enableOnFormTags: true }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (transcript) {
        setMessage((prev) => prev ? prev + ' ' + transcript : transcript);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      alert('Speech recognition error: ' + event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = async () => {
    if (!message) return;
    try {
      await invoke('ask_send', { message: JSON.stringify(message) });
    } catch (error) {
      console.error('Error sending message:', error);
    }
    // Optionally speak the message after sending
    if (autoSpeak) speak(message);
    setMessage('');
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative flex h-full dark:bg-app-gray-2/[0.98] bg-gray-100 dark:text-slate-200 items-center gap-1">
      <textarea
        ref={inputRef}
        onChange={handleInput}
        spellCheck="false"
        autoFocus
        className="w-full h-full pl-3 pr-[110px] py-2 outline-none resize-none bg-transparent"
        placeholder="Type your message here..."
      />

      {/* TTS controls */}
      <div className="absolute right-12 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
        <select
          aria-label="Voice"
          value={voiceIndex ?? ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const idx = e.target.value === '' ? null : Number(e.target.value);
            setVoiceIndex(idx);
            // persist by name/lang
            try {
              const v = idx === null ? null : voices[idx];
              invoke('set_tts_pref', { voice_name: v ? v.name : null, voice_lang: v ? v.lang : null, auto: autoSpeak });
            } catch {}
          }}
          className="text-xs bg-white dark:bg-gray-700 border rounded px-1 py-0"
        >
          {voices.length === 0 && <option value="">(no voices)</option>}
          {voices.map((v: SpeechSynthesisVoice, i: number) => (
            <option key={i} value={i}>{v.name}{v.lang ? ` (${v.lang})` : ''}</option>
          ))}
        </select>
        <select
          aria-label="TTS preset"
          value={ttsPreset}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const val = e.target.value as any;
            setTtsPreset(val);
            setVisualEnabled(val === 'supersain');
            try {
              invoke('set_visual_preset', { preset: val });
            } catch {}
          }}
          className="text-xs bg-white dark:bg-gray-700 border rounded px-1 py-0"
          title="Choose a stylized preset (non-impersonating)">
          <option value="default">Default</option>
          <option value="energetic-hero">Energetic (stylized)</option>
          <option value="supersain">Supersain (stylized)</option>
        </select>
        {(ttsPreset === 'energetic-hero' || ttsPreset === 'supersain') && (
          <div className="text-[10px] text-gray-500 dark:text-gray-400 px-1">
            Stylized voice preset — not intended to impersonate any real person or copyrighted character.
          </div>
        )}
        <button
          title="Speak (Alt+S)"
          onClick={() => speak(message || 'No message to speak')}
          className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded"
        >
          🔊
        </button>
        <button
          title="Stop (Alt+Shift+S)"
          onClick={stopSpeaking}
          className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded"
        >
          ⏹
        </button>
        <button
          title="Listen (voice input)"
          onClick={handleVoiceInput}
          className={`text-sm px-2 py-1 rounded ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
        >
          🎤
        </button>
        <label className="text-xs flex items-center gap-1">
          <input type="checkbox" checked={autoSpeak} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setAutoSpeak(e.target.checked);
            try {
              const v = voiceIndex === null ? null : voices[voiceIndex];
              invoke('set_tts_pref', { voice_name: v ? v.name : null, voice_lang: v ? v.lang : null, auto: e.target.checked });
            } catch {}
          }} />
          Auto
        </label>
      </div>

      <SendIcon
        size={30}
        className="absolute right-2 text-gray-400/80 dark:text-gray-600 cursor-pointer"
        onClick={handleSend}
        title={`Send message (${isMac ? '⌘⏎' : '⌃⏎'})`}
        aria-label="Send message"
      />

      {/* Avatar (small) */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        <div>
          <Avatar speaking={isSpeaking} preset={visualEnabled ? 'supersain' : (ttsPreset as any)} />
        </div>
        <label className="text-xs flex items-center gap-1 select-none" title="Toggle aura (supersain visual)">
          <input
            type="checkbox"
            checked={visualEnabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const enabled = e.target.checked;
              setVisualEnabled(enabled);
              const newPreset = enabled ? 'supersain' : 'default';
              setTtsPreset(newPreset as any);
              try {
                invoke('set_visual_preset', { preset: enabled ? newPreset : null });
              } catch {}
            }}
          />
          Aura
        </label>
      </div>
      {/* Approved apps launcher */}
      <div className="absolute left-20 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        <select className="text-xs bg-white dark:bg-gray-700 border rounded px-1 py-0" value={selectedApp ?? ''} onChange={(e) => setSelectedApp(e.target.value)}>
          {approvedApps.length === 0 && <option value="">(no approved apps)</option>}
          {approvedApps.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <button className="text-xs px-2 py-1 bg-blue-500 text-white rounded" onClick={async () => {
          if (!selectedApp) return;
          const ok = window.confirm(`Run approved app: ${selectedApp}?`);
          if (!ok) return;
          try {
            const res: string = await invoke('run_approved_app', { action: selectedApp });
            alert(res);
          } catch (err) {
            alert('Failed to run app: ' + err);
          }
        }}>Run</button>
      </div>

      {/* Learning submission */}
      <div className="absolute left-48 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
        <input type="text" placeholder="Name" value={learningName} onChange={(e) => setLearningName(e.target.value)} className="text-xs px-1 py-1 border rounded bg-white dark:bg-gray-700" />
        <input type="text" placeholder="Command" value={learningCommand} onChange={(e) => setLearningCommand(e.target.value)} className="text-xs px-1 py-1 border rounded bg-white dark:bg-gray-700" />
        <button className="text-xs px-2 py-1 bg-green-500 text-white rounded" onClick={async () => {
          if (!learningName || !learningCommand) { alert('Fill in name and command'); return; }
          try {
            await invoke('submit_learning', { name: learningName, command: learningCommand });
            setLearningName('');
            setLearningCommand('');
            const learnings: any[] = await invoke('get_pending_learnings');
            setPendingLearnings(learnings || []);
            alert('Learning submitted for approval!');
          } catch (err) {
            alert('Failed: ' + err);
          }
        }}>Learn</button>
        {pendingLearnings.length > 0 && (
          <div className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded border">
            {pendingLearnings.length} pending
          </div>
        )}
        <button className="text-xs px-2 py-1 bg-purple-500 text-white rounded" onClick={async () => {
          if (pendingLearnings.length === 0) { alert('No pending learnings'); return; }
          let msg = 'Pending learnings:\n\n';
          pendingLearnings.forEach((l, i) => {
            msg += `${i + 1}. ${l.name} (${l.command})\n`;
          });
          alert(msg);
          const idx = window.prompt('Index to approve (1-' + pendingLearnings.length + ') or reject with r1, r2, etc:');
          if (!idx) return;
          if (idx.startsWith('r')) {
            const ridx = parseInt(idx.substring(1)) - 1;
            if (ridx >= 0 && ridx < pendingLearnings.length) {
              try {
                await invoke('reject_learning', { name: pendingLearnings[ridx].name });
                const learnings: any[] = await invoke('get_pending_learnings');
                setPendingLearnings(learnings || []);
                alert('Rejected!');
              } catch (err) {
                alert('Failed: ' + err);
              }
            }
          } else {
            const aidx = parseInt(idx) - 1;
            if (aidx >= 0 && aidx < pendingLearnings.length) {
              try {
                await invoke('approve_learning', { name: pendingLearnings[aidx].name });
                const learnings: any[] = await invoke('get_pending_learnings');
                setPendingLearnings(learnings || []);
                const apps: string[] = await invoke('get_approved_apps');
                setApprovedApps(apps || []);
                alert('Approved!');
              } catch (err) {
                alert('Failed: ' + err);
              }
            }
          }
        }}>Review</button>
      </div>

      {/* YouTube learning */}
      <div className="absolute left-[360px] top-1/2 transform -translate-y-1/2 flex items-center gap-1">
        <input type="text" placeholder="YouTube URL" value={youtubeUrl} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYoutubeUrl(e.target.value)} className="text-xs px-1 py-1 border rounded bg-white dark:bg-gray-700" />
        <button className="text-xs px-2 py-1 bg-red-500 text-white rounded" onClick={async () => {
          if (!youtubeUrl) { alert('Paste a YouTube URL'); return; }
          try {
            const info: any = await invoke('extract_youtube_info', { url: youtubeUrl });
            alert('Extracted: ' + info.title + '\n\nNote: ' + info.note + '\n\nVideo ID: ' + info.video_id);
            setLearningName(info.title);
            setLearningCommand(info.video_id);
            setYoutubeUrl('');
          } catch (err) {
            alert('Failed to extract: ' + err);
          }
        }}>Extract</button>
      </div>
    </div>
  );
}
