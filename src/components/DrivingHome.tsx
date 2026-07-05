import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Square, AlertTriangle, Radio, Shield, 
  Volume2, VolumeX, Eye, Info, Navigation, ShieldAlert, Zap
} from 'lucide-react';
import { Hazard, DrivingStats, AlertLog } from '../types';

interface DrivingHomeProps {
  stats: DrivingStats;
  setStats: React.Dispatch<React.SetStateAction<DrivingStats>>;
  alerts: AlertLog[];
  addAlert: (alert: Omit<AlertLog, 'id' | 'timestamp'>) => void;
  activeHazards: Hazard[];
  triggerCustomEvent: (type: string) => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  onSOS: () => void;
}

export default function DrivingHome({
  stats,
  setStats,
  alerts,
  addAlert,
  activeHazards,
  triggerCustomEvent,
  isSimulating,
  setIsSimulating,
  onSOS
}: DrivingHomeProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [laneStatus, setLaneStatus] = useState<'CENTER' | 'DRIFTING_LEFT' | 'DRIFTING_RIGHT'>('CENTER');
  const [dayNightMode, setDayNightMode] = useState<'day' | 'night'>('day');
  const [obdConnected, setObdConnected] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto increment distance & simulate safe driving score updates when active
  useEffect(() => {
    if (isSimulating) {
      timerRef.current = setInterval(() => {
        setStats(prev => {
          const nextSeconds = prev.durationSeconds + 1;
          const nextDistance = parseFloat((prev.distance + 0.015).toFixed(3)); // 15 meters per sec (54 km/h)
          return {
            ...prev,
            durationSeconds: nextSeconds,
            distance: nextDistance
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSimulating]);

  // Generate TTS Voice warning helper
  const playVoiceAlert = (message: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // clear previous
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Safe manual helper triggers
  const handleTrigger = (eventKey: string) => {
    if (!isSimulating) {
      setIsSimulating(true);
    }
    triggerCustomEvent(eventKey);

    // Voice scripts
    switch(eventKey) {
      case 'wrong_way':
        playVoiceAlert("Critical Alert! Wrong-way vehicle detected ahead. Slow down and steer left immediately!");
        break;
      case 'pothole':
        playVoiceAlert("Caution. Large pothole spotted 50 meters ahead.");
        break;
      case 'drowsy':
        playVoiceAlert("Warning. Drowsiness detected. Please pull over at the next rest stop.");
        break;
      case 'lane_drift':
        playVoiceAlert("Lane departure warning. Steer right.");
        break;
      case 'speed_sign':
        playVoiceAlert("Speed limit changed to 60 kilometers per hour.");
        break;
      default:
        break;
    }
  };

  const activeBannerAlert = alerts.length > 0 ? alerts[0] : null;

  return (
    <div className="w-full flex flex-col space-y-4">
      
      {/* SECTION 2.1: CONDITIONAL TOP DANGER BANNER */}
      {activeBannerAlert && activeBannerAlert.severity !== 'low' && (
        <div className={`p-4 rounded-2xl flex items-center justify-between text-left transition-all animate-bounce ${
          activeBannerAlert.severity === 'critical' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' :
          activeBannerAlert.severity === 'high' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' :
          'bg-amber-400 text-slate-900 shadow-md shadow-amber-400/10'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full animate-pulse-red">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-80">
                🚨 ROADGUARD SECURITY CORE ALERT
              </p>
              <h3 className="font-display font-bold text-base leading-tight">
                {activeBannerAlert.message}
              </h3>
            </div>
          </div>
          <button 
            onClick={() => {
              // Quick alert acknowledgment
              playVoiceAlert("Alert acknowledged");
            }} 
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold transition-all"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* SECTION 2.2: LIVE ADAS CAMERA CANVAS OVERLAY */}
      <div className="nm-raised rounded-[28px] p-4 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isSimulating ? 'bg-red-500 animate-pulse-red' : 'bg-gray-400'}`} />
            <span className="text-xs font-bold font-mono tracking-wider">
              {isSimulating ? '🔴 ADAS HUD LIVE REC' : '⚪ CAMERA PAUSED'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setDayNightMode(prev => prev === 'day' ? 'night' : 'day')}
              className="p-1.5 nm-raised hover:nm-inset rounded-full text-[#636E72] transition-all"
              title="Toggle Day/Night Mode"
            >
              <span className="text-xs font-bold px-2">{dayNightMode.toUpperCase()}</span>
            </button>
            
            <button 
              onClick={() => setVoiceEnabled(prev => !prev)}
              className="p-1.5 nm-raised hover:nm-inset rounded-full text-[#636E72] transition-all"
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-red-500" />}
            </button>
          </div>
        </div>

        {/* Camera Simulator viewport */}
        <div className={`relative h-72 md:h-96 rounded-2xl overflow-hidden transition-all duration-700 ${
          dayNightMode === 'day' 
            ? 'bg-gradient-to-b from-sky-300 via-sky-100 to-slate-200' 
            : 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-800'
        }`}>
          
          {/* Depth/Horizon Grid */}
          <div className={`absolute inset-0 opacity-20 pointer-events-none ${
            dayNightMode === 'day' ? 'bg-[radial-gradient(#000000_1px,transparent_1px)]' : 'bg-[radial-gradient(#ffffff_1px,transparent_1px)]'
          } [background-size:20px_20px]`} />

          {/* Simulated Mountains/Buildings background */}
          <div className="absolute bottom-1/2 w-full h-1/4 flex items-end justify-between px-8 opacity-40">
            <div className="w-24 h-12 bg-slate-400/40 rounded-t-full" />
            <div className="w-32 h-16 bg-slate-400/30 rounded-t-full" />
            <div className="w-20 h-10 bg-slate-400/50 rounded-t-full" />
          </div>

          {/* Safe Horizon line */}
          <div className="absolute top-1/2 w-full border-t border-dashed border-blue-500/40 flex justify-between px-4 items-center">
            <span className="text-[8px] text-blue-500/70 font-mono">CALIBRATION HORIZON</span>
            <span className="text-[8px] text-blue-500/70 font-mono">YAW: 0.2° pitch</span>
          </div>

          {/* Road Perspectives & Lane Lines */}
          <svg className="absolute bottom-0 w-full h-1/2 pointer-events-none" viewBox="0 0 100 50">
            {/* The Road Surface */}
            <polygon points="15,50 45,0 55,0 85,50" fill="#334155" opacity="0.9" />
            
            {/* Left Lane boundary */}
            <line 
              x1="15" y1="50" x2="45" y2="0" 
              stroke={stats.laneDepartures > 5 ? "#EF4444" : "#10B981"} 
              strokeWidth="1.5" 
              className={laneStatus === 'DRIFTING_LEFT' ? 'animate-pulse' : ''}
            />
            
            {/* Dashed Center separator */}
            <line 
              x1="50" y1="50" x2="50" y2="0" 
              stroke="#FBBF24" 
              strokeWidth="0.8" 
              strokeDasharray="4 3" 
            />
            
            {/* Right Lane boundary */}
            <line 
              x1="85" y1="50" x2="55" y2="0" 
              stroke="#10B981" 
              strokeWidth="1.5"
            />
          </svg>

          {/* Simulated Bounding Boxes based on active hazards */}
          {activeHazards.map(h => (
            <div 
              key={h.id}
              className="absolute pointer-events-none transition-all duration-1000 border-2 rounded p-1"
              style={{
                borderColor: h.severity === 'critical' ? '#EF4444' : h.severity === 'high' ? '#F97316' : '#FBBF24',
                backgroundColor: h.severity === 'critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(249, 115, 22, 0.1)',
                width: `${120 - h.distance * 1.5}px`,
                height: `${80 - h.distance}px`,
                left: `${40 + (h.type === 'wrong_way' ? -15 : h.type === 'pothole' ? 10 : 0)}%`,
                bottom: `${Math.max(10, 80 - h.distance * 1.6)}px`
              }}
            >
              <div className="absolute -top-6 left-0 flex items-center space-x-1 bg-slate-900/85 text-white text-[8px] font-mono py-0.5 px-1.5 rounded">
                <span className="font-bold uppercase">{h.name}</span>
                <span className="opacity-80">| {h.confidence}%</span>
              </div>
            </div>
          ))}

          {/* Windshield Speedometer HUD overlay */}
          <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-900/75 backdrop-blur-sm text-left text-white border border-white/10">
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">SPEED TARGET</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-display font-bold tracking-tight">{stats.speed}</span>
              <span className="text-xs font-mono font-medium text-slate-400">KM/H</span>
            </div>
          </div>

          <div className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/75 backdrop-blur-sm text-white flex items-center space-x-1.5 border border-white/10 text-[9px] font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>AI ENGINE ACTIVE</span>
          </div>

          {/* Drowsiness Face Tracking Reticle */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 p-2 rounded-2xl bg-black/35 backdrop-blur-xs flex flex-col items-center border border-white/5">
            <div className="w-12 h-12 border-2 border-emerald-400 rounded-full flex items-center justify-center animate-pulse">
              <Eye className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-[7px] font-mono mt-1 text-emerald-400 tracking-wider">DRIVER RETINA LOCK</span>
          </div>

          {/* Conditional Warn indicators */}
          {laneStatus !== 'CENTER' && (
            <div className="absolute bottom-10 left-12 right-12 py-2 bg-red-600/90 text-white font-bold text-xs rounded-full text-center tracking-wide animate-pulse shadow-lg">
              ⚠️ LANE DEPARTURE DRIFT DETECTED
            </div>
          )}
        </div>

        {/* Controller controls for Simulator */}
        <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex space-x-2">
            {isSimulating ? (
              <button 
                onClick={() => {
                  setIsSimulating(false);
                  playVoiceAlert("Driving assistance system standby");
                }}
                className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl nm-raised transition-all"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>STANDBY</span>
              </button>
            ) : (
              <button 
                onClick={() => {
                  setIsSimulating(true);
                  playVoiceAlert("RoadGuardian driving assistance active. See the road, know the risk, drive safe.");
                }}
                className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl nm-raised transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>ACTIVATE ADAS</span>
              </button>
            )}
            
            <button 
              onClick={onSOS}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl nm-raised shadow-red-500/20"
            >
              🚨 EMERGENCY SOS
            </button>
          </div>

          <span className="text-[10px] font-mono font-medium text-[#636E72]">
            OBD MONITOR: {obdConnected ? '🟢 CONNECTED (CAN-BUS)' : '🔴 DISCONNECTED'}
          </span>
        </div>
      </div>

      {/* SECTION 2.3: REAL-TIME HUD STRIP */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'GPS SPEED', value: `${stats.speed} km/h`, color: 'text-[#2D3436]' },
          { label: 'TRIP DIS.', value: `${stats.distance} km`, color: 'text-blue-600' },
          { label: 'ADAS SCORE', value: `${stats.score}/100`, color: 'text-emerald-600' },
          { label: 'RISK COUNT', value: `${alerts.filter(a => a.severity !== 'low').length} Active`, color: 'text-red-500' }
        ].map((hud, i) => (
          <div key={i} className="p-3 nm-inset rounded-2xl flex flex-col items-center text-center">
            <span className="text-[8px] font-bold text-[#636E72] font-mono uppercase tracking-wider mb-1">
              {hud.label}
            </span>
            <span className={`text-sm md:text-base font-display font-black ${hud.color}`}>
              {hud.value}
            </span>
          </div>
        ))}
      </div>

      {/* SECTION 2.4: VIRTUAL LIVE TEST TRIGGER PANEL */}
      <div className="nm-raised rounded-[24px] p-4 text-left">
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold font-mono text-[#636E72] tracking-wider uppercase">
            SIMULATE EDGE-AI EVENT ACTIONS
          </h4>
        </div>
        <p className="text-[11px] text-[#636E72] mb-4 leading-relaxed">
          Tap an event action to simulate on-device sensor triggers. Watch the ADAS dashboard, safety score, part wear predictions, alerts history, and emergency triggers respond dynamically!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          {[
            { id: 'wrong_way', label: '🚗 Wrong-Way Driver', color: 'hover:border-red-500 hover:text-red-600' },
            { id: 'pothole', label: '🕳️ Pothole Spun', color: 'hover:border-orange-400 hover:text-orange-500' },
            { id: 'drowsy', label: '😴 Drowsy Driver', color: 'hover:border-amber-500 hover:text-amber-600' },
            { id: 'lane_drift', label: '🛣️ Lane Drift Out', color: 'hover:border-blue-500 hover:text-blue-600' },
            { id: 'speed_sign', label: '🛑 Speed Limit 60', color: 'hover:border-emerald-500 hover:text-emerald-600' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => handleTrigger(btn.id)}
              className={`p-2.5 nm-raised hover:nm-inset rounded-xl text-[10px] font-bold text-[#2D3436] transition-all border border-transparent ${btn.color}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
