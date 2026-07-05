import React, { useState } from 'react';
import { 
  Eye, Shield, AlertTriangle, HelpCircle, Activity, Info, 
  MapPin, Check, Sliders, Play, TrendingUp, Calendar, AlertOctagon,
  School, Compass, Navigation
} from 'lucide-react';
import { DrivingStats, AlertLog } from '../types';

/* ==========================================
   1. DRIVER MONITORING COMPONENT
   ========================================== */
interface DriverMonitoringProps {
  stats: DrivingStats;
  alerts: AlertLog[];
}

export function DriverMonitoring({ stats, alerts }: DriverMonitoringProps) {
  const [fatigueScore, setFatigueScore] = useState(12);
  const [sensitivity, setSensitivity] = useState<'low' | 'medium' | 'high'>('medium');

  const drowsinessAlerts = alerts.filter(a => a.type.toLowerCase().includes('drowsy') || a.type.toLowerCase().includes('fatigue'));

  return (
    <div className="space-y-4">
      {/* Driver status visualizer card */}
      <div className="nm-raised rounded-[24px] p-5 text-left">
        <h3 className="text-sm font-bold font-mono text-[#636E72] uppercase tracking-wider mb-3">
          ● EYE-GAZE FOCUS MONITOR
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Simulated Face camera feed */}
          <div className="relative h-44 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
            {/* Camera feed overlay */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black opacity-60" />
            
            {/* Vector face mesh simulation overlay */}
            <svg className="w-40 h-40 text-emerald-400 opacity-75" viewBox="0 0 100 100">
              {/* Head contour */}
              <path d="M50,15 C35,15 25,28 25,50 C25,72 35,85 50,85 C65,85 75,72 75,50 C75,28 65,15 50,15 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              {/* Left Eye tracker */}
              <circle cx="40" cy="40" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="40" cy="40" r="1.5" fill="currentColor" />
              {/* Right Eye tracker */}
              <circle cx="60" cy="40" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="60" cy="40" r="1.5" fill="currentColor" />
              {/* Mouth tracker */}
              <path d="M40,65 Q50,70 60,65" fill="none" stroke="currentColor" strokeWidth="1.5" />
              {/* Nose Bridge */}
              <line x1="50" y1="40" x2="50" y2="58" stroke="currentColor" strokeWidth="1.5" />
            </svg>

            <span className="absolute bottom-2 left-2 text-[9px] font-mono text-emerald-400 bg-black/50 px-2 py-0.5 rounded">
              GAZE: ROADSIDE EYE LOCK
            </span>
            <span className="absolute top-2 right-2 text-[9px] font-mono text-emerald-400 bg-black/50 px-2 py-0.5 rounded flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              <span>99.2% LOCK</span>
            </span>
          </div>

          {/* Real-time stats */}
          <div className="flex flex-col justify-between space-y-3">
            <div className="p-3 nm-inset rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#636E72]">Drowsiness Events</span>
              <span className="text-sm font-bold text-red-500 font-mono">{stats.drowsyEvents}</span>
            </div>
            <div className="p-3 nm-inset rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#636E72]">Gaze Attention status</span>
              <span className="text-sm font-bold text-emerald-600">🟢 Alert</span>
            </div>
            <div className="p-3 nm-inset rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#636E72]">Seatbelt buckle status</span>
              <span className="text-sm font-bold text-emerald-600">🟢 Fastened</span>
            </div>
            <div className="p-3 nm-inset rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#636E72]">Avg blink frequency</span>
              <span className="text-sm font-bold text-[#2D3436] font-mono">14 blinks/min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fatigue Meter and Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 nm-raised rounded-[24px] text-center flex flex-col items-center justify-center">
          <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase mb-3">
            FATIGUE INDEX RISK GAUGE
          </h3>
          
          <div className="w-32 h-32 nm-inset rounded-full flex items-center justify-center relative">
            <div className="w-24 h-24 nm-raised rounded-full flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-black text-emerald-600">{12 + stats.drowsyEvents * 15}%</span>
              <span className="text-[9px] text-[#636E72] uppercase font-mono font-bold mt-1">FATIGUE</span>
            </div>
            
            {/* SVG progress ring indicator */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle 
                cx="64" cy="64" r="56" 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="6" 
                strokeDasharray={`${(12 + stats.drowsyEvents * 15) * 3.5} 360`} 
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
          </div>

          <p className="text-xs text-[#636E72] mt-3 font-semibold">
            {stats.drowsyEvents > 0 ? "⚠️ Alert fatigue level rising. Take rest soon." : "🟢 Driver is alert, sleep deprivation zero."}
          </p>
        </div>

        {/* Logs */}
        <div className="p-5 nm-raised rounded-[24px] text-left">
          <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase mb-3">
            RECENT ALERT HISTORY LOG
          </h3>
          
          {drowsinessAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-36 text-[#636E72]">
              <Check className="w-8 h-8 text-emerald-500 mb-2" />
              <p className="text-xs font-semibold">No driver fatigue incidents logged today</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {drowsinessAlerts.map(alert => (
                <div key={alert.id} className="p-3 nm-inset rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-semibold text-slate-800">{alert.message}</span>
                  </div>
                  <span className="text-[9px] text-[#636E72] font-mono">{alert.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sensitivity adjustments */}
      <div className="p-4 nm-raised rounded-2xl flex items-center justify-between text-left">
        <div>
          <h4 className="text-xs font-bold text-[#2D3436]">Detection Sensitivity</h4>
          <p className="text-[10px] text-[#636E72]">Adjust facial landmark lock trigger times</p>
        </div>
        <div className="flex space-x-1.5">
          {['low', 'medium', 'high'].map(sens => (
            <button
              key={sens}
              onClick={() => setSensitivity(sens as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${sensitivity === sens ? 'nm-inset text-blue-600' : 'nm-raised text-[#636E72]'}`}
            >
              {sens}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ==========================================
   2. LANE DETECTION COMPONENT
   ========================================== */
interface LaneDetectionProps {
  stats: DrivingStats;
  alerts: AlertLog[];
}

export function LaneDetection({ stats, alerts }: LaneDetectionProps) {
  const [laneWidth, setLaneWidth] = useState(3.4); // meters
  const [warningTone, setWarningTone] = useState(true);

  const laneAlerts = alerts.filter(a => a.type.toLowerCase().includes('lane'));

  return (
    <div className="space-y-4">
      
      {/* Live Perspective Card */}
      <div className="nm-raised rounded-[24px] p-5 text-left">
        <h3 className="text-sm font-bold font-mono text-[#636E72] uppercase tracking-wider mb-2">
          ● REAL-TIME LANE DEPARTURE VISUALIZER
        </h3>
        <p className="text-[10px] text-[#636E72] mb-4">
          Tracking lane offset. Green marker indicates dead center. Color turns orange or red upon indicator-less drift.
        </p>

        {/* Lane drift gauge */}
        <div className="p-4 nm-inset rounded-2xl flex flex-col items-center">
          <div className="w-full h-8 bg-slate-900 rounded-lg relative flex items-center justify-between px-4 border border-slate-800 overflow-hidden">
            <span className="text-[9px] font-mono font-bold text-red-500">L-OUT</span>
            <span className="text-[9px] font-mono font-bold text-emerald-400">CENTER</span>
            <span className="text-[9px] font-mono font-bold text-red-500">R-OUT</span>

            {/* Micro road perspective lines overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-red-500 via-emerald-400 to-red-500 opacity-60" />

            {/* Tracking marker */}
            <div className="absolute top-1/2 -mt-3.5 w-7 h-7 bg-white rounded-full nm-raised flex items-center justify-center transition-all duration-300"
              style={{ left: `calc(${50 + (stats.laneDepartures > 0 ? 25 : 0)}% - 14px)` }}
            >
              <div className={`w-3.5 h-3.5 rounded-full ${stats.laneDepartures > 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
            </div>
          </div>
          <div className="flex justify-between w-full text-[9px] font-mono text-[#636E72] mt-1.5 px-1">
            <span>LEFT BIAS (-1.2m)</span>
            <span>CURRENT LANE WIDTH: {laneWidth}M</span>
            <span>RIGHT BIAS (+1.2m)</span>
          </div>
        </div>
      </div>

      {/* Grid Status stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Settings */}
        <div className="p-5 nm-raised rounded-[24px] text-left space-y-4">
          <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase">
            LANE WARNING PARAMS
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Audio Haptic Warn</span>
              <button 
                onClick={() => setWarningTone(prev => !prev)}
                className={`w-12 h-6 rounded-full p-0.5 transition-all ${warningTone ? 'bg-emerald-500 flex justify-end nm-inset' : 'bg-slate-400 flex justify-start nm-inset'}`}
              >
                <div className="w-5 h-5 bg-white rounded-full shadow" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Lane Detection Threshold</span>
              <span className="font-mono font-bold text-blue-600">85% confidence</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Auto Road Edge Backup</span>
              <span className="font-mono font-bold text-emerald-600">Active</span>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="p-5 nm-raised rounded-[24px] text-left">
          <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase mb-3">
            LANE DEPARTURE LOGS
          </h3>
          
          {laneAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-28 text-[#636E72]">
              <Check className="w-8 h-8 text-emerald-500 mb-1" />
              <p className="text-xs font-semibold">Perfect lane discipline today!</p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
              {laneAlerts.map(alert => (
                <div key={alert.id} className="p-2 nm-inset rounded-xl flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                    <span className="font-semibold text-slate-800">{alert.message}</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#636E72]">{alert.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

/* ==========================================
   3. TRAFFIC SIGN RECOGNITION COMPONENT
   ========================================== */
interface TrafficSignRecognitionProps {
  stats: DrivingStats;
  alerts: AlertLog[];
}

export function TrafficSignRecognition({ stats, alerts }: TrafficSignRecognitionProps) {
  const [currentLimit, setCurrentLimit] = useState(60);

  const speedLimitAlerts = alerts.filter(a => a.type.toLowerCase().includes('speed') || a.type.toLowerCase().includes('sign'));

  return (
    <div className="space-y-4">
      
      {/* Current Sign Card */}
      <div className="nm-raised rounded-[24px] p-5 text-left">
        <h3 className="text-sm font-bold font-mono text-[#636E72] uppercase tracking-wider mb-4">
          ● ON-ROAD TRAFFIC SIGNS DECODED
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-around gap-6">
          {/* Circular Speed Limit Badge */}
          <div className="w-28 h-28 border-[6px] border-red-500 bg-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all">
            <span className="text-4xl font-display font-black text-slate-900">{stats.speedViolations > 0 ? '60' : '80'}</span>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <div className="text-sm font-bold text-[#2D3436]">Current Limit: <span className="text-red-500 font-mono font-black">{stats.speedViolations > 0 ? '60' : '80'} KM/H</span></div>
            <div className="text-xs text-[#636E72]">Your Current GPS Speed: <span className="font-mono font-bold text-blue-600">{stats.speed} km/h</span></div>
            <div className="py-1 px-3 bg-emerald-100 border border-emerald-300 text-emerald-700 font-bold rounded-lg text-xs flex items-center justify-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>{stats.speed > (stats.speedViolations > 0 ? 60 : 80) ? "🚨 OVERSPEEDING WARNING!" : "SPEED SAFETY COMPLIANT"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zones alert */}
      <div className="p-4 nm-raised rounded-[20px] text-left flex items-center space-x-3 bg-amber-50/50 border border-amber-200">
        <div className="p-2 bg-amber-100 rounded-full text-amber-600">
          <School className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#2D3436]">Approaching Active School Crossing</h4>
          <p className="text-[10px] text-[#636E72]">Recommended limit: 30 km/h. High-sensitivity pedestrian sensors activated.</p>
        </div>
      </div>

      {/* Detected Thumbnails catalog list */}
      <div className="p-5 nm-raised rounded-[24px] text-left">
        <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase mb-3">
          DETECTED ROAD SIGNS GALLERY
        </h3>
        
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {[
            { sign: '🛑', label: 'Stop Sign', conf: '98%' },
            { sign: '⚡ 60', label: 'Speed 60', conf: '94%' },
            { sign: '🏫', label: 'School Zone', conf: '89%' },
            { sign: '🚷', label: 'No Entry', conf: '95%' },
            { sign: '⚠️ 🕳️', label: 'Rough Road', conf: '92%' }
          ].map((item, i) => (
            <div key={i} className="flex-none p-3 nm-inset rounded-xl flex flex-col items-center justify-center w-20 text-center">
              <span className="text-xl mb-1">{item.sign}</span>
              <span className="text-[8px] font-bold text-slate-800 leading-tight block truncate w-full">{item.label}</span>
              <span className="text-[7px] text-[#636E72] font-mono mt-0.5">{item.conf}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ==========================================
   4. COLLISION WARNING COMPONENT
   ========================================== */
interface CollisionWarningProps {
  stats: DrivingStats;
  alerts: AlertLog[];
}

export function CollisionWarning({ stats, alerts }: CollisionWarningProps) {
  const ttcValue = stats.hardBrakes > 0 ? 1.4 : 3.8;

  return (
    <div className="space-y-4">
      
      {/* Semi Radar Circle Panel */}
      <div className="nm-raised rounded-[24px] p-5 text-left">
        <h3 className="text-sm font-bold font-mono text-[#636E72] uppercase tracking-wider mb-2">
          ● FORWARD RADAR FIELD (TTC CALCULATOR)
        </h3>
        
        <div className="flex flex-col md:flex-row items-center gap-6 justify-around">
          
          {/* Radar visualization using clean SVG */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full text-slate-300" viewBox="0 0 100 100">
              {/* Outer arcs */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
              
              {/* Polar Grid line dividers */}
              <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.25" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.25" />

              {/* Sweeper animation line */}
              <line x1="50" y1="50" x2="80" y2="20" stroke="#10B981" strokeWidth="1" className="origin-center animate-spin" style={{ animationDuration: '4s' }} />

              {/* Simulated obstacles ahead */}
              {/* Obstacle 1: Leading vehicle */}
              <circle cx="50" cy="25" r="3" fill={ttcValue < 2 ? "#EF4444" : "#F59E0B"} className="animate-pulse" />
              {/* Obstacle 2: Pedestrian right side */}
              <circle cx="75" cy="40" r="2.5" fill="#10B981" />
            </svg>

            <span className="absolute bottom-1 text-[9px] font-mono font-bold text-slate-500">RADAR LOCK: 32m</span>
          </div>

          {/* Time to Collision readout */}
          <div className="text-center md:text-left space-y-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#636E72] block">TIME-TO-COLLISION</span>
              <div className="flex items-baseline space-x-1 justify-center md:justify-start">
                <span className={`text-4xl font-display font-black ${ttcValue < 2 ? 'text-red-500 animate-pulse' : 'text-emerald-600'}`}>{ttcValue}</span>
                <span className="text-xs font-mono font-semibold text-[#636E72]">SECONDS</span>
              </div>
            </div>

            <div className={`py-1 px-3 rounded-lg text-xs font-bold uppercase text-center ${
              ttcValue < 2 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {ttcValue < 2 ? "🔴 BRAKE IMMEDIATELY!" : "🟢 SAFE DISTANCE KEPT"}
            </div>
          </div>
        </div>
      </div>

      {/* Safe Gap distance table guide */}
      <div className="p-5 nm-raised rounded-[24px] text-left">
        <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase mb-3">
          DYNAMIC FOLLOWING DISTANCE SAFETY GUIDE
        </h3>

        <div className="space-y-2.5">
          {[
            { speed: '30 km/h', distance: '15 Meters', ratio: '████░░░░░░ 1.8s' },
            { speed: '60 km/h', distance: '30 Meters', ratio: '██████░░░░ 1.8s' },
            { speed: '100 km/h', distance: '55 Meters', ratio: '█████████░ 2.0s' }
          ].map((row, idx) => (
            <div key={idx} className="p-3 nm-inset rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-800">{row.speed}</span>
              <span className="text-blue-600 font-semibold">{row.distance}</span>
              <span className="text-[10px] text-[#636E72] font-bold">{row.ratio}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
