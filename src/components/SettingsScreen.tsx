import React, { useState } from 'react';
import { 
  Settings, User, Sliders, Volume2, Shield, Eye, Bell, 
  MapPin, LogOut, Camera, HelpCircle, HardDrive, Sparkles
} from 'lucide-react';
import { Role, VehicleSetup } from '../types';

interface SettingsScreenProps {
  role: Role;
  vehicle: VehicleSetup;
  onLogout: () => void;
}

export default function SettingsScreen({ role, vehicle, onLogout }: SettingsScreenProps) {
  // Toggle states
  const [driverLock, setDriverLock] = useState(true);
  const [laneWarn, setLaneWarn] = useState(true);
  const [collisionWarn, setCollisionWarn] = useState(true);
  const [signScan, setSignScan] = useState(true);
  const [autoRec, setAutoRec] = useState(true);
  const [communityShare, setCommunityShare] = useState(true);

  // Range states
  const [volume, setVolume] = useState(80);
  const [hapticIntensity, setHapticIntensity] = useState<'off' | 'light' | 'strong'>('light');
  const [aiConfidence, setAiConfidence] = useState(75);

  const calibrateCamera = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Camera calibration sequence completed. All angles verified."));
    }
    alert("Camera Pitch/Yaw coordinates successfully calibrated!");
  };

  return (
    <div className="space-y-4">
      
      {/* Profile summary card */}
      <div className="nm-raised rounded-[24px] p-5 text-left flex items-center space-x-4">
        <div className="w-14 h-14 rounded-full nm-inset flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold uppercase text-lg shadow-inner">
            {role.substring(0, 2)}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-[#2D3436] capitalize flex items-center space-x-2">
            <span>Rajesh Kumar</span>
            <span className="text-[8px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              {role.toUpperCase()}
            </span>
          </h4>
          <p className="text-[10px] text-[#636E72] mt-0.5">
            🚙 {vehicle.makeModel} • Plate: {vehicle.registration} ({vehicle.fuelType})
          </p>
        </div>
      </div>

      {/* SECTION 1: AI & DETECTION TOGGLES */}
      <div className="nm-raised rounded-[24px] p-5 text-left space-y-4">
        <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>● EDGE-AI NETWORK ON-DEVICE ENGINES</span>
        </h3>

        <div className="space-y-3">
          {[
            { label: '👁️ Driver Gaze Monitoring', desc: 'Retina tracking for sleep deprivation checks', state: driverLock, setter: setDriverLock },
            { label: '🛣️ Lane departure scan', desc: 'Warning trigger for lane boundaries drift', state: laneWarn, setter: setLaneWarn },
            { label: '🚗 Collision warn calculations', desc: 'TTC distance algorithms scanner', state: collisionWarn, setter: setCollisionWarn },
            { label: '🛑 Traffic signs recognition', desc: 'Reads speed limits & schools zones', state: signScan, setter: setSignScan },
            { label: '📹 Auto loop crash rec', desc: 'Saves loops on ADAS warnings triggers', state: autoRec, setter: setAutoRec }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 border-b border-[#A3B1C6]/15 last:border-0">
              <div className="max-w-[75%]">
                <h5 className="text-xs font-bold text-slate-800">{item.label}</h5>
                <p className="text-[9px] text-[#636E72] leading-tight">{item.desc}</p>
              </div>

              <button 
                onClick={() => item.setter(prev => !prev)}
                className={`w-11 h-5.5 rounded-full p-0.5 transition-all ${item.state ? 'bg-emerald-500 flex justify-end nm-inset' : 'bg-slate-400 flex justify-start nm-inset'}`}
              >
                <div className="w-4.5 h-4.5 bg-white rounded-full shadow" />
              </button>
            </div>
          ))}
        </div>

        {/* AI Confidence Threshold slider */}
        <div className="pt-2">
          <div className="flex justify-between text-[10px] text-[#636E72] font-mono mb-1">
            <span>AI TRIGGER THRESHOLD</span>
            <span className="font-bold text-blue-600">{aiConfidence}% CONFIDENCE</span>
          </div>
          <input 
            type="range" 
            min="50" 
            max="95" 
            value={aiConfidence} 
            onChange={e => setAiConfidence(parseInt(e.target.value))}
            className="w-full accent-blue-600 bg-[#A3B1C6]/30 h-1.5 rounded-lg appearance-none outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* SECTION 2: AUDIO & ALERTS */}
      <div className="nm-raised rounded-[24px] p-5 text-left space-y-4">
        <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase flex items-center space-x-1.5">
          <Volume2 className="w-4 h-4 text-blue-500" />
          <span>● AUDITORY & HAPTIC ALERTS</span>
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] text-[#636E72] font-mono mb-1">
              <span>ALERTS SPEAKER VOLUME</span>
              <span className="font-bold text-slate-800">{volume}%</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="100" 
              value={volume} 
              onChange={e => setVolume(parseInt(e.target.value))}
              className="w-full accent-blue-600 bg-[#A3B1C6]/30 h-1.5 rounded-lg appearance-none outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Haptic intensity</span>
            <div className="flex space-x-1">
              {['off', 'light', 'strong'].map(int => (
                <button
                  key={int}
                  onClick={() => setHapticIntensity(int as any)}
                  className={`px-3 py-1 rounded-lg text-[9px] font-mono font-bold uppercase transition-all ${hapticIntensity === int ? 'nm-inset text-blue-600' : 'nm-raised text-[#636E72]'}`}
                >
                  {int}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: HARDWARE CALIBRATION */}
      <div className="nm-raised rounded-[24px] p-5 text-left space-y-3">
        <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase flex items-center space-x-1.5">
          <Camera className="w-4 h-4 text-slate-700" />
          <span>● HARDWARE MOUNT ACCELEROMETER</span>
        </h3>
        <p className="text-[10px] text-[#636E72] leading-relaxed">
          Re-align phone orientation parameters. Calibration establishes dead-center bounds, eliminating false collision or lane drift notifications.
        </p>
        <button
          onClick={calibrateCamera}
          className="w-full py-3 nm-raised hover:nm-inset text-blue-600 font-bold text-xs rounded-xl transition-all"
        >
          CALIBRATE MOUNT PARAMETERS
        </button>
      </div>

      {/* SECTION 4: PRIVACY */}
      <div className="nm-raised rounded-[24px] p-5 text-left space-y-3">
        <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase flex items-center space-x-1.5">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>● DATA RETENTION & SHARING</span>
        </h3>

        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-slate-800 block">Anonymized civic sharing</span>
            <span className="text-[9px] text-[#636E72]">Help city councils by reporting potholes</span>
          </div>

          <button 
            onClick={() => setCommunityShare(prev => !prev)}
            className={`w-11 h-5.5 rounded-full p-0.5 transition-all ${communityShare ? 'bg-emerald-500 flex justify-end nm-inset' : 'bg-slate-400 flex justify-start nm-inset'}`}
          >
            <div className="w-4.5 h-4.5 bg-white rounded-full shadow" />
          </button>
        </div>
      </div>

      {/* VERSION LOGOUT */}
      <div className="pt-2 flex flex-col items-center space-y-4">
        <span className="text-[9px] font-mono text-[#636E72] uppercase tracking-widest">
          ROADGUARDIAN AI • V1.4.0 EDGE-PRO • TATA INNOVENT 2026
        </span>

        <button 
          onClick={onLogout}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl nm-raised flex items-center space-x-1.5 shadow-lg shadow-red-500/10 active:scale-95 transition-transform"
        >
          <LogOut className="w-4 h-4" />
          <span>LOG OUT USER SESSION</span>
        </button>
      </div>

    </div>
  );
}
