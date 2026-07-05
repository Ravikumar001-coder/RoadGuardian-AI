import React, { useState } from 'react';
import { 
  AlertTriangle, Check, Compass, ShieldAlert, Award, ChevronRight,
  TrendingUp, Calendar, Zap, RefreshCw, ThumbsUp, AlertCircle
} from 'lucide-react';
import { Hazard, DrivingStats } from '../types';

/* ==========================================
   1. ROAD HAZARD DETECTION COMPONENT
   ========================================== */
interface RoadHazardDetectionProps {
  activeHazards: Hazard[];
  onReportClick: () => void;
}

export function RoadHazardDetection({ activeHazards, onReportClick }: RoadHazardDetectionProps) {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const getSeverityBadgeColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'bg-red-100 text-red-600 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-600 border-orange-300';
      case 'medium': return 'bg-amber-100 text-amber-600 border-amber-300';
      default: return 'bg-emerald-100 text-emerald-600 border-emerald-300';
    }
  };

  const filteredHazards = filter === 'all' 
    ? activeHazards 
    : activeHazards.filter(h => h.severity === filter || (filter === 'high' && h.severity === 'critical'));

  return (
    <div className="space-y-4">
      {/* Overview Stat indicators */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 nm-raised rounded-2xl text-center">
          <span className="text-[9px] font-bold text-[#636E72] font-mono block">CRITICAL</span>
          <span className="text-xl font-display font-black text-red-600">
            {activeHazards.filter(h => h.severity === 'critical' || h.severity === 'high').length}
          </span>
        </div>
        <div className="p-3.5 nm-raised rounded-2xl text-center">
          <span className="text-[9px] font-bold text-[#636E72] font-mono block">MEDIUM</span>
          <span className="text-xl font-display font-black text-amber-500">
            {activeHazards.filter(h => h.severity === 'medium').length}
          </span>
        </div>
        <div className="p-3.5 nm-raised rounded-2xl text-center">
          <span className="text-[9px] font-bold text-[#636E72] font-mono block">CIVIC REPORTS</span>
          <span className="text-xl font-display font-black text-blue-600">24</span>
        </div>
      </div>

      {/* List container */}
      <div className="nm-raised rounded-[24px] p-5 text-left">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold font-mono text-[#636E72] uppercase tracking-wider">
            ● HAZARDS LOGGED ON ACTIVE ROUTE
          </h3>
          
          <div className="flex space-x-1.5">
            {['all', 'high', 'medium'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${filter === f ? 'nm-inset text-blue-600' : 'nm-raised text-[#636E72]'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredHazards.length === 0 ? (
          <div className="p-8 text-center text-[#636E72] flex flex-col items-center justify-center">
            <Check className="w-10 h-10 text-emerald-500 mb-2" />
            <p className="text-xs font-bold">No active anomalies detected on this road stretch.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHazards.map(haz => (
              <div key={haz.id} className="p-3.5 nm-inset rounded-2xl flex items-center justify-between hover:scale-[1.01] transition-transform">
                <div className="flex items-center space-x-3 text-left">
                  <div className="p-2 nm-raised rounded-full text-red-500">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2D3436] flex items-center space-x-1.5">
                      <span>{haz.name}</span>
                      <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border ${getSeverityBadgeColor(haz.severity)}`}>
                        {haz.severity.toUpperCase()}
                      </span>
                    </h4>
                    <p className="text-[9px] text-[#636E72] mt-0.5">
                      📍 {haz.location} • Confidence: {haz.confidence}% • {haz.distance}m ahead
                    </p>
                  </div>
                </div>
                
                <ChevronRight className="w-4 h-4 text-[#636E72]" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual contribution prompt CTA */}
      <div className="p-4 nm-raised rounded-[20px] flex items-center justify-between text-left">
        <div>
          <h4 className="text-xs font-bold text-slate-800">Spotted a road defect?</h4>
          <p className="text-[10px] text-[#636E72]">Instantly log potholes to warn other drivers and authorities.</p>
        </div>
        <button 
          onClick={onReportClick}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors nm-raised"
        >
          REPORT HAZARD
        </button>
      </div>

    </div>
  );
}

/* ==========================================
   2. DRIVING SCORE COMPONENT
   ========================================== */
interface DrivingScoreProps {
  stats: DrivingStats;
  setStats: React.Dispatch<React.SetStateAction<DrivingStats>>;
}

export function DrivingScore({ stats, setStats }: DrivingScoreProps) {
  return (
    <div className="space-y-4">
      {/* Circular Progress score card */}
      <div className="nm-raised rounded-[24px] p-6 text-center flex flex-col items-center">
        <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase mb-4">
          CUMULATIVE BEHAVIOR SAFETY SCORE
        </h3>

        <div className="w-36 h-36 nm-inset rounded-full flex items-center justify-center relative">
          <div className="w-28 h-28 nm-raised rounded-full flex flex-col items-center justify-center">
            <span className="text-4xl font-display font-black text-slate-900">{stats.score}</span>
            <span className="text-[10px] text-[#636E72] font-mono font-bold mt-1">SAFE DRIVER</span>
          </div>

          {/* Render circular score meter using SVG */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle 
              cx="72" cy="72" r="62" 
              fill="none" 
              stroke="#10B981" 
              strokeWidth="6" 
              strokeDasharray={`${stats.score * 3.9} 390`} 
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
        </div>

        <div className="flex items-center space-x-1.5 mt-4 text-emerald-600">
          <Award className="w-5 h-5" />
          <span className="text-xs font-bold">Top 12% Drivers in your city region</span>
        </div>
      </div>

      {/* Detailed metrics bars breakdown */}
      <div className="p-5 nm-raised rounded-[24px] text-left">
        <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase mb-4">
          SCORING COMPLIANCE AUDIT
        </h3>

        <div className="space-y-4">
          {[
            { name: 'Speed Limit Adherence', value: Math.max(60, 100 - stats.speedViolations * 15), icon: '🚗' },
            { name: 'Braking G-Force safety', value: Math.max(50, 100 - stats.hardBrakes * 12), icon: '🛑' },
            { name: 'Retina Lock Attention ratio', value: Math.max(70, 100 - stats.drowsyEvents * 18), icon: '👁️' },
            { name: 'Lane Departure compliance', value: Math.max(60, 100 - stats.laneDepartures * 10), icon: '🛣️' }
          ].map((metric, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 flex items-center space-x-2">
                  <span>{metric.icon}</span>
                  <span>{metric.name}</span>
                </span>
                <span className="font-bold text-slate-900 font-mono">{metric.value}/100</span>
              </div>
              <div className="w-full h-2.5 nm-inset rounded-full p-0.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    metric.value >= 85 ? 'bg-emerald-500' : metric.value >= 70 ? 'bg-amber-400' : 'bg-red-500'
                  }`} 
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habits diagnostics tips */}
      <div className="p-5 nm-raised rounded-[24px] text-left">
        <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase mb-3">
          💡 AI DRIVING COACH RECOMMENDATIONS
        </h3>
        
        <div className="space-y-2 text-xs text-[#636E72]">
          {stats.hardBrakes > 0 && (
            <div className="p-3 nm-inset rounded-xl flex items-start space-x-2.5">
              <span className="text-red-500">●</span>
              <p>Detected <strong>{stats.hardBrakes} hard brake G-force event(s)</strong>. Increase following distances to avoid high-force reaction stops.</p>
            </div>
          )}
          {stats.laneDepartures > 0 && (
            <div className="p-3 nm-inset rounded-xl flex items-start space-x-2.5">
              <span className="text-amber-500">●</span>
              <p>Lane drift logged <strong>{stats.laneDepartures} time(s)</strong>. Always signal intent before changing paths to improve your rank.</p>
            </div>
          )}
          {stats.drowsyEvents > 0 && (
            <div className="p-3 nm-inset rounded-xl flex items-start space-x-2.5">
              <span className="text-red-600 font-bold">●</span>
              <p>Drowsy alert triggered <strong>{stats.drowsyEvents} times</strong>. Avoid long-haul shifts without hourly safety breaks.</p>
            </div>
          )}
          {stats.hardBrakes === 0 && stats.laneDepartures === 0 && stats.drowsyEvents === 0 && (
            <div className="p-3 nm-inset rounded-xl flex items-start space-x-2.5">
              <span className="text-emerald-500">●</span>
              <p>Excellent road discipline. Keep up the flawless pace to claim your weekly safe driver insurance discount badge!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

/* ==========================================
   3. COMMUTE TRIP HISTORY COMPONENT
   ========================================== */
interface TripHistoryProps {
  stats: DrivingStats;
}

export function TripHistory({ stats }: TripHistoryProps) {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const mockTrips = [
    { id: 'trip1', title: '☀️ Morning Commute to Office', date: 'Today, 8:15 AM', distance: '12.4 km', duration: '34 min', score: 94, hazards: 2 },
    { id: 'trip2', title: '🌙 Evening Commercial Return', date: 'Yesterday, 6:45 PM', distance: '18.1 km', duration: '52 min', score: stats.score, hazards: stats.activeHazards },
    { id: 'trip3', title: '🌧️ Highway Inter-city comm', date: '04 July 2026', distance: '54.0 km', duration: '1h 10m', score: 82, hazards: 12 }
  ];

  return (
    <div className="space-y-4">
      
      {/* Trip aggregates */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'TOTAL TRIPS', value: '24' },
          { label: 'TOTAL DISTANCE', value: '412 KM' },
          { label: 'AVG TRIP SCORE', value: '89%' },
          { label: 'HAZARDS REVEALED', value: '88 Logged' }
        ].map((item, i) => (
          <div key={i} className="p-3 nm-raised rounded-xl text-center">
            <span className="text-[8px] font-bold text-[#636E72] font-mono uppercase block">{item.label}</span>
            <span className="text-sm font-display font-black text-[#2D3436] mt-0.5">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Trips list */}
      <div className="nm-raised rounded-[24px] p-5 text-left">
        <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase mb-3">
          HISTORICAL TRIP LOGS
        </h3>

        <div className="space-y-3">
          {mockTrips.map(trip => (
            <div 
              key={trip.id} 
              onClick={() => setSelectedTripId(selectedTripId === trip.id ? null : trip.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all ${selectedTripId === trip.id ? 'nm-inset' : 'nm-raised hover:nm-inset'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-[#2D3436]">{trip.title}</h4>
                  <p className="text-[10px] text-[#636E72] mt-0.5">{trip.date} • {trip.distance} ({trip.duration})</p>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 text-xs font-mono font-black rounded-lg border ${
                    trip.score >= 90 ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-amber-100 text-amber-600 border-amber-200'
                  }`}>
                    {trip.score} pts
                  </span>
                </div>
              </div>

              {/* Collapsed detailed trip metrics */}
              {selectedTripId === trip.id && (
                <div className="mt-3 pt-3 border-t border-slate-300/40 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  <div className="p-2 nm-inset rounded-lg">
                    <span className="text-[#636E72] block">HAZARDS SEEN</span>
                    <span className="font-bold text-red-500 mt-0.5">{trip.hazards}</span>
                  </div>
                  <div className="p-2 nm-inset rounded-lg">
                    <span className="text-[#636E72] block">AVG SPEED</span>
                    <span className="font-bold text-slate-800 mt-0.5">42 km/h</span>
                  </div>
                  <div className="p-2 nm-inset rounded-lg">
                    <span className="text-[#636E72] block">INTELLIGENCE</span>
                    <span className="font-bold text-emerald-600 mt-0.5">ADAS LOOP OK</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
