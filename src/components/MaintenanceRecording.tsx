import React, { useState } from 'react';
import { 
  Wrench, Activity, AlertTriangle, Shield, Check, Play, Share2, Trash2, 
  Settings, Clock, HardDrive, ToggleLeft, ShieldAlert
} from 'lucide-react';
import { DrivingStats, ComponentHealth, SavedClip } from '../types';

interface MaintenanceRecordingProps {
  stats: DrivingStats;
  clips: SavedClip[];
  addClip: (clip: SavedClip) => void;
  removeClip: (id: string) => void;
}

export default function MaintenanceRecording({
  stats,
  clips,
  addClip,
  removeClip
}: MaintenanceRecordingProps) {
  const [obdCode, setObdCode] = useState<string | null>(null);
  const [recordingMode, setRecordingMode] = useState<'loop' | 'event' | 'manual'>('loop');
  const [playClipId, setPlayClipId] = useState<string | null>(null);

  // Calculate parts health based on physical stress events
  const initialHealth: ComponentHealth[] = [
    { name: '🛞 Tyre Tread Wear', percentage: Math.max(25, 88 - stats.distance * 0.08 - stats.hardBrakes * 1.5), status: 'Good', icon: 'tyre', wearFactor: 'Pothole impacts and sliding drag' },
    { name: '🛑 Brake Pad Friction', percentage: Math.max(30, 92 - stats.hardBrakes * 4.5), status: 'Good', icon: 'brake', wearFactor: 'High G-force hard deceleration' },
    { name: '⚙️ Suspension Bushings', percentage: Math.max(20, 84 - stats.distance * 0.05 - stats.laneDepartures * 2), status: 'Good', icon: 'suspension', wearFactor: 'High frequency chassis impacts' },
    { name: '🛢️ Engine Oil Viscosity', percentage: Math.max(40, 95 - stats.distance * 0.15), status: 'Good', icon: 'oil', wearFactor: 'Thermal load & continuous running' }
  ];

  const processedHealth = initialHealth.map(item => {
    let status: ComponentHealth['status'] = 'Good';
    if (item.percentage < 45) status = 'Service Soon';
    else if (item.percentage < 65) status = 'Check';
    else if (item.percentage < 80) status = 'Monitor';
    return { ...item, status };
  });

  const getStatusColor = (status: ComponentHealth['status']) => {
    switch (status) {
      case 'Service Soon': return 'text-red-500 font-bold';
      case 'Check': return 'text-orange-500 font-bold';
      case 'Monitor': return 'text-amber-500 font-bold';
      default: return 'text-emerald-500 font-bold';
    }
  };

  const runObdDiagnostic = () => {
    // Generate simulated CAN-BUS diagnostic check
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Initializing OBD CAN-BUS sensor query... All systems operational. Brake pads wear estimated at forty-five percent. Viscosity normal."));
    }
    setObdCode('P0000 - OBD SCANNED: NO CRITICAL ENGINE ERROR CODES ACTIVE');
  };

  return (
    <div className="space-y-4">
      
      {/* 1. VEHICLE MAINTENANCE PREDICTION */}
      <div className="nm-raised rounded-[24px] p-5 text-left">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold font-mono text-[#636E72] uppercase tracking-wider flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-amber-500" />
            <span>● PART DEGRADATION PREDICTION (AI MODEL)</span>
          </h3>
          
          <button 
            onClick={runObdDiagnostic}
            className="text-[10px] font-bold font-mono px-3 py-1.5 nm-raised hover:nm-inset rounded-lg text-blue-600 transition-all"
          >
            RUN CAN-BUS DIAG
          </button>
        </div>

        <p className="text-[10px] text-[#636E72] mb-4">
          Predicted health index calculated by correlating CAN-Bus accelerometers, continuous mileage, and G-force stops.
        </p>

        {obdCode && (
          <div className="mb-4 p-3 nm-inset rounded-xl bg-slate-900 text-emerald-400 font-mono text-[9px] uppercase tracking-wider flex items-center justify-between">
            <span>{obdCode}</span>
            <button onClick={() => setObdCode(null)} className="text-white hover:text-red-400">✕</button>
          </div>
        )}

        {/* Component Wear Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {processedHealth.map((part, i) => (
            <div key={i} className="p-3.5 nm-inset rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-[#2D3436] leading-tight">{part.name}</span>
                <span className={`text-[10px] uppercase font-mono ${getStatusColor(part.status)}`}>
                  {part.status}
                </span>
              </div>

              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[9px] text-[#636E72] font-mono">
                  <span>PREDICTED WEAR</span>
                  <span>{part.percentage.toFixed(0)}% HEALTHY</span>
                </div>
                
                <div className="w-full h-2 nm-raised rounded-full overflow-hidden p-0.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      part.percentage >= 80 ? 'bg-emerald-500' : part.percentage >= 60 ? 'bg-amber-400' : 'bg-red-500'
                    }`} 
                    style={{ width: `${part.percentage}%` }}
                  />
                </div>
              </div>

              <span className="text-[8px] text-[#636E72] font-mono mt-2 uppercase block">
                WEAR CORE: {part.wearFactor}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stress logs */}
      <div className="p-4 nm-raised rounded-2xl text-left bg-blue-50/50 border border-blue-200">
        <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5 mb-1">
          <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
          <span>ROUTE STRESS METRICS THIS TRIP</span>
        </h4>
        <p className="text-[10px] text-[#636E72]">
          Your route exposed the chassis to <strong>{stats.hardBrakes} hard deceleration stops</strong> and <strong>{stats.laneDepartures} lane drift impacts</strong>. Hitting potholes accelerates wheel misalignment wear by ~23%.
        </p>
      </div>

      {/* 2. AUTOMATIC INCIDENT EVENT RECORDING (DASHCAM) */}
      <div className="nm-raised rounded-[24px] p-5 text-left">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold font-mono text-[#636E72] uppercase tracking-wider flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>● ADAS EVENT PLAYBACK & VIDEO ARCHIVES</span>
          </h3>

          <div className="flex space-x-1">
            {['loop', 'event', 'manual'].map(mode => (
              <button
                key={mode}
                onClick={() => setRecordingMode(mode as any)}
                className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${recordingMode === mode ? 'nm-inset text-blue-600' : 'nm-raised text-[#636E72]'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Storage status bar */}
        <div className="p-3.5 nm-inset rounded-2xl mb-4 text-xs font-mono text-[#636E72]">
          <div className="flex justify-between mb-1.5">
            <span>DASHCAM VIRTUAL SSD DISK SPACE</span>
            <span className="font-bold text-slate-800">2.3 GB / 8.0 GB</span>
          </div>
          <div className="w-full h-2.5 nm-raised rounded-full overflow-hidden p-0.5">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '28%' }} />
          </div>
        </div>

        {clips.length === 0 ? (
          <div className="p-8 nm-inset rounded-2xl text-center text-[#636E72]">
            <p className="text-xs font-semibold">No critical crash risk loops archived yet.</p>
            <p className="text-[10px] mt-1 text-[#636E72]">Trigger a simulated road danger to test automatic G-Force loops!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clips.map(clip => (
              <div key={clip.id} className="p-4 nm-inset rounded-2xl flex flex-col space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 text-left">
                    {/* Thumbnail placeholder with play */}
                    <div className="w-14 h-10 bg-slate-900 rounded flex items-center justify-center text-white relative group overflow-hidden border border-white/10 shadow-inner">
                      <Play className="w-4 h-4 text-white group-hover:scale-125 transition-transform" />
                      <div className="absolute top-0 left-0 bg-red-600 text-[6px] font-bold px-1 py-0.2 uppercase rounded-br">
                        {clip.severity}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2D3436]">{clip.title}</h4>
                      <p className="text-[9px] text-[#636E72] mt-0.5">
                        📍 {clip.location} • Speed: {clip.speed} km/h • Clip: {clip.duration}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono text-[#636E72]">{clip.time}</span>
                </div>

                {/* Simulated video playback viewport */}
                {playClipId === clip.id && (
                  <div className="relative h-44 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                    <video className="hidden" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 bg-gradient-to-t from-slate-950 to-slate-900">
                      <ShieldAlert className="w-8 h-8 text-red-500 animate-bounce mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider font-mono">CRITICAL SAFETY EVIDENCE LOOP PLAYBACK</span>
                      <span className="text-[9px] font-mono mt-1 text-slate-400">GPS ACCELEROMETER OVERLAY: ACTIVE • LOOP LOCKED</span>
                      
                      {/* Interactive mock timeline */}
                      <div className="w-4/5 h-1 bg-white/20 rounded mt-4 overflow-hidden relative">
                        <div className="absolute left-0 h-full bg-red-500 w-1/3 animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Clip Action Buttons */}
                <div className="flex justify-between items-center pt-1">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setPlayClipId(playClipId === clip.id ? null : clip.id)}
                      className="px-3 py-1.5 text-[9px] font-mono font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      {playClipId === clip.id ? '⏸ PAUSE' : '▶ PLAY证据'}
                    </button>
                    <button 
                      onClick={() => alert(`Evidence video link exported to clipboard for insurance processing: https://roadguardian.ai/clip/${clip.id}`)}
                      className="p-1.5 nm-raised hover:nm-inset text-blue-600 rounded-lg transition-all"
                      title="Share clip link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      removeClip(clip.id);
                      if (playClipId === clip.id) setPlayClipId(null);
                    }}
                    className="p-1.5 nm-raised hover:nm-inset text-red-500 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
