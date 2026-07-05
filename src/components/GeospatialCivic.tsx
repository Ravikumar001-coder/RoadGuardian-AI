import React, { useState, useEffect } from 'react';
import { 
  MapPin, ShieldAlert, Check, Phone, Users, Landmark, AlertTriangle, 
  Map, Search, Filter, Compass, Plus, Send, Radio, HeartPulse, Clock, FileText
} from 'lucide-react';
import { Hazard, AlertLog, CommunityReport } from '../types';

interface GeospatialCivicProps {
  alerts: AlertLog[];
  addAlert: (alert: Omit<AlertLog, 'id' | 'timestamp'>) => void;
  activeHazards: Hazard[];
  communityReports: CommunityReport[];
  submitCommunityReport: (report: Omit<CommunityReport, 'id' | 'timestamp' | 'status'>) => void;
  onSOS: () => void;
  showSosOverlay: boolean;
  cancelSOS: () => void;
}

export default function GeospatialCivic({
  alerts,
  addAlert,
  activeHazards,
  communityReports,
  submitCommunityReport,
  onSOS,
  showSosOverlay,
  cancelSOS
}: GeospatialCivicProps) {
  
  // Tab states
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'alerts' | 'contribute' | 'emergency'>('map');
  const [mapLayer, setMapLayer] = useState<'pins' | 'heatmap'>('pins');
  const [alertFilter, setAlertFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  // SOS counter
  const [sosCountdown, setSosCountdown] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSosOverlay && sosCountdown > 0) {
      timer = setInterval(() => {
        setSosCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Trigger voice or trigger final state
            if ('speechSynthesis' in window) {
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(new SpeechSynthesisUtterance("SOS emergency transmission activated. Emergency services and fleet managers notified of location coordinates."));
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!showSosOverlay) {
      setSosCountdown(5);
    }
    return () => clearInterval(timer);
  }, [showSosOverlay, sosCountdown]);

  // Report Form state
  const [reportForm, setReportForm] = useState({
    type: 'pothole',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    location: 'NH-19, Near Asansol Junction',
    description: '',
    submitToULB: true
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCommunityReport({
      type: reportForm.type,
      severity: reportForm.severity,
      location: reportForm.location,
      description: reportForm.description
    });
    // Trigger TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Thank you. Your report regarding a ${reportForm.type} has been uploaded to the municipal authorities.`));
    }
    // reset description
    setReportForm(prev => ({ ...prev, description: '' }));
    alert('Hazard submitted to local ULB portal successfully!');
  };

  const getAlertSeverityColor = (sev: string) => {
    switch(sev) {
      case 'critical': return 'border-red-500 bg-red-50 text-red-700';
      case 'high': return 'border-orange-400 bg-orange-50 text-orange-700';
      case 'medium': return 'border-amber-400 bg-amber-50 text-amber-700';
      default: return 'border-emerald-400 bg-emerald-50 text-emerald-700';
    }
  };

  const filteredAlertLogs = alertFilter === 'all'
    ? alerts
    : alerts.filter(a => a.severity === alertFilter);

  return (
    <div className="space-y-4">
      
      {/* 4-way subtab bar */}
      <div className="flex p-1.5 nm-inset rounded-[20px] justify-between">
        {[
          { id: 'map', label: '🗺️ LIVE MAP' },
          { id: 'alerts', label: '⚠️ ALERTS LOG' },
          { id: 'contribute', label: '📢 CIVIC REPORT' },
          { id: 'emergency', label: '🆘 EMERGENCY' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex-1 py-2 text-[10px] md:text-xs font-bold rounded-xl transition-all ${activeSubTab === tab.id ? 'nm-raised text-blue-600' : 'text-[#636E72] hover:text-[#2D3436]'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: MAP VIEW */}
      {activeSubTab === 'map' && (
        <div className="space-y-4">
          <div className="nm-raised rounded-[24px] p-5 text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold font-mono text-[#636E72] uppercase tracking-wider flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-blue-500" />
                <span>● COMMUNITY RISK GPS HEATMAP</span>
              </h3>

              <div className="flex p-0.5 nm-inset rounded-lg">
                <button
                  onClick={() => setMapLayer('pins')}
                  className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${mapLayer === 'pins' ? 'nm-raised text-blue-600' : 'text-[#636E72]'}`}
                >
                  PINS
                </button>
                <button
                  onClick={() => setMapLayer('heatmap')}
                  className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${mapLayer === 'heatmap' ? 'nm-raised text-blue-600' : 'text-[#636E72]'}`}
                >
                  HEATMAP
                </button>
              </div>
            </div>

            {/* Simulated Live GPS Map rendering */}
            <div className="relative h-80 bg-slate-100 rounded-2xl overflow-hidden border border-slate-300 shadow-inner flex items-center justify-center">
              
              {/* Virtual SVG street layout */}
              <svg className="absolute inset-0 w-full h-full text-slate-300 opacity-60 pointer-events-none" viewBox="0 0 400 300">
                {/* Main highways */}
                <line x1="50" y1="0" x2="100" y2="300" stroke="#CBD5E1" strokeWidth="8" />
                <line x1="0" y1="120" x2="400" y2="120" stroke="#CBD5E1" strokeWidth="8" />
                <line x1="180" y1="0" x2="180" y2="300" stroke="#F1F5F9" strokeWidth="4" />
                {/* City grid streets */}
                <line x1="0" y1="50" x2="400" y2="50" stroke="#E2E8F0" strokeWidth="2" />
                <line x1="0" y1="200" x2="400" y2="200" stroke="#E2E8F0" strokeWidth="2" />
                <line x1="300" y1="0" x2="300" y2="300" stroke="#E2E8F0" strokeWidth="2" />
              </svg>

              {mapLayer === 'pins' ? (
                <>
                  {/* Real-time hazard location coordinates pins overlay */}
                  {activeHazards.map((haz, idx) => (
                    <div 
                      key={haz.id}
                      className="absolute group cursor-pointer"
                      style={{
                        left: `${150 + idx * 45}px`,
                        top: `${130 + idx * 30}px`
                      }}
                    >
                      <div className="relative">
                        <MapPin className={`w-6 h-6 drop-shadow ${
                          haz.severity === 'critical' ? 'text-red-500 animate-bounce' :
                          haz.severity === 'high' ? 'text-orange-500' : 'text-amber-500'
                        }`} />
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center border border-slate-800">
                          <span className="text-[6px] font-bold">⚠️</span>
                        </div>
                      </div>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 p-2 bg-slate-900/90 text-white rounded text-[8px] font-mono leading-tight whitespace-nowrap shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="font-bold uppercase">{haz.name}</span><br />
                        <span>DISTANCE: {haz.distance}M</span>
                      </div>
                    </div>
                  ))}

                  {/* Active Vehicle indicator pin */}
                  <div className="absolute left-[130px] top-[110px] flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white ring-4 ring-blue-500/30">
                      <Radio className="w-2.5 h-2.5 text-white animate-pulse" />
                    </div>
                    <span className="text-[8px] font-mono font-bold bg-blue-600 text-white px-1 rounded mt-1">WB23AB1234</span>
                  </div>
                </>
              ) : (
                /* Heatmap cluster overlay visualization */
                <div className="absolute inset-0 bg-red-500/10 pointer-events-none flex items-center justify-center">
                  <div className="absolute w-44 h-44 bg-red-500/20 rounded-full filter blur-xl animate-pulse" />
                  <div className="absolute w-24 h-24 bg-orange-400/30 rounded-full filter blur-lg" />
                  <span className="text-red-600 font-mono font-bold text-xs bg-white/80 px-3 py-1 rounded-full shadow border border-red-300">
                    CRITICAL DAMAGE REGION PINPOINTED
                  </span>
                </div>
              )}

              {/* Map controls */}
              <div className="absolute bottom-3 left-3 p-2 bg-white/90 rounded-lg text-[9px] font-mono text-slate-800 border border-slate-200">
                📍 LAT: 23.6889° N • LNG: 86.9749° E
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: ALERTS CENTER LOG */}
      {activeSubTab === 'alerts' && (
        <div className="nm-raised rounded-[24px] p-5 text-left">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold font-mono text-[#636E72] uppercase tracking-wider">
              ● REAL-TIME ADAS RISK LOG CHRONICLE
            </h3>

            <div className="flex space-x-1">
              {['all', 'critical', 'high', 'medium'].map(filterItem => (
                <button
                  key={filterItem}
                  onClick={() => setAlertFilter(filterItem as any)}
                  className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all ${alertFilter === filterItem ? 'nm-inset text-blue-600' : 'nm-raised text-[#636E72]'}`}
                >
                  {filterItem}
                </button>
              ))}
            </div>
          </div>

          {filteredAlertLogs.length === 0 ? (
            <div className="p-8 text-center text-[#636E72]">
              <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold">Risk logs clear. Drive on safely.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredAlertLogs.map(log => (
                <div key={log.id} className={`p-4 rounded-2xl border-l-4 border transition-all ${getAlertSeverityColor(log.severity)}`}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono font-bold tracking-wider uppercase block">
                        [{log.severity.toUpperCase()}] COGNITIVE NOTIFICATION
                      </span>
                      <h4 className="font-bold text-sm text-slate-800">{log.message}</h4>
                      <p className="text-[10px] text-slate-500">
                        📍 {log.location} • Speed: {log.speed} km/h • Time: {log.timestamp}
                      </p>
                    </div>

                    {log.hasVideo && (
                      <span className="bg-blue-100 text-blue-700 text-[8px] font-mono font-black py-0.5 px-2 rounded-full border border-blue-200">
                        VIDEO SAVED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: CIVIC DIRECT REPORT FORMS */}
      {activeSubTab === 'contribute' && (
        <div className="space-y-4">
          <form onSubmit={handleFormSubmit} className="nm-raised rounded-[24px] p-5 text-left space-y-4">
            <h3 className="text-sm font-bold font-mono text-[#636E72] uppercase tracking-wider">
              ● CIVIC REPORT PORTAL (DIRECT TO MUNICIPAL ULB)
            </h3>
            
            <p className="text-[10px] text-[#636E72] leading-relaxed">
              Discovered potholes, missing safety barriers, or non-functional traffic lights? Log it here. Your report automatically triggers validation checks and alerts municipal maintenance managers.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-mono font-bold text-[#636E72] block mb-1">ANOMALY CLASS</label>
                <select 
                  value={reportForm.type}
                  onChange={e => setReportForm(p => ({ ...prev => p, type: e.target.value }))}
                  className="w-full p-2.5 nm-inset rounded-xl text-xs outline-none focus:text-blue-600 bg-transparent text-[#2D3436]"
                >
                  <option value="pothole">🕳️ Large Pothole</option>
                  <option value="waterlogging">💧 Waterlogging</option>
                  <option value="debris">🚧 Route Debris</option>
                  <option value="accident">💥 Accident Site</option>
                  <option value="road_crack">🛣️ Structural Crack</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-mono font-bold text-[#636E72] block mb-1">DAMAGE SEVERITY</label>
                <select 
                  value={reportForm.severity}
                  onChange={e => setReportForm(p => ({ ...prev => p, severity: e.target.value as any }))}
                  className="w-full p-2.5 nm-inset rounded-xl text-xs outline-none focus:text-blue-600 bg-transparent text-[#2D3436]"
                >
                  <option value="low">🟢 Low (Debris)</option>
                  <option value="medium">🟡 Medium (Crack)</option>
                  <option value="high">🔴 High (Pothole)</option>
                  <option value="critical">🚨 Critical (Blockade)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-mono font-bold text-[#636E72] block mb-1">GPS STREET ADDRESS</label>
              <input 
                type="text" 
                value={reportForm.location}
                onChange={e => setReportForm(p => ({ ...prev => p, location: e.target.value }))}
                required
                className="w-full p-3 nm-inset rounded-xl text-xs outline-none text-[#2D3436] font-semibold"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono font-bold text-[#636E72] block mb-1">EXPLANATORY NOTES</label>
              <textarea 
                value={reportForm.description}
                onChange={e => setReportForm(p => ({ ...prev => p, description: e.target.value }))}
                placeholder="Describe width, depth, or visual safety factors..."
                className="w-full p-3 nm-inset rounded-xl text-xs outline-none text-[#2D3436] h-16 resize-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="ulb_portal" 
                checked={reportForm.submitToULB}
                onChange={e => setReportForm(p => ({ ...prev => p, submitToULB: e.target.checked }))}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <label htmlFor="ulb_portal" className="text-[10px] text-slate-700 font-semibold cursor-pointer">
                Route verified copy to Municipal Works Board (ULB) for immediate action
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl nm-raised transition-colors flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SUBMIT MUNICIPAL REPORT</span>
            </button>
          </form>

          {/* Submitted list tracking status */}
          <div className="nm-raised rounded-[24px] p-5 text-left">
            <h3 className="text-xs font-bold text-[#636E72] font-mono tracking-wider uppercase mb-3">
              MY SUBMITTED REPORTS WORKFLOW
            </h3>

            <div className="space-y-3">
              {communityReports.map(report => (
                <div key={report.id} className="p-4 nm-inset rounded-2xl">
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 uppercase flex items-center space-x-1.5">
                        <span>{report.type} reported</span>
                        <span className={`text-[7px] font-mono py-0.5 px-2 rounded-full border ${getAlertSeverityColor(report.severity)}`}>
                          {report.severity.toUpperCase()}
                        </span>
                      </h4>
                      <p className="text-[9px] text-[#636E72] mt-0.5">📍 {report.location}</p>
                    </div>

                    <span className={`text-[8px] font-mono font-black px-2 py-0.5 rounded-full ${
                      report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' :
                      report.status === 'Acknowledged' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                      'bg-slate-100 text-slate-600 border border-slate-300'
                    }`}>
                      {report.status.toUpperCase()}
                    </span>
                  </div>

                  {report.description && (
                    <p className="text-[10px] text-[#636E72] bg-[#E0E5EC] p-2 rounded-lg border border-[#A3B1C6]/30">
                      {report.description}
                    </p>
                  )}

                  {report.responseMessage && (
                    <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] rounded-lg">
                      <strong>🏛️ AUTHORITY:</strong> {report.responseMessage}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: SOS EMERGENCIES */}
      {activeSubTab === 'emergency' && (
        <div className="space-y-4">
          <div className="nm-raised rounded-[24px] p-5 text-left text-center flex flex-col items-center">
            <h3 className="text-xs font-bold text-red-600 font-mono tracking-wider uppercase mb-4">
              HIGH-PRIORITY SOS DISPATCH SYSTEM
            </h3>

            <button 
              onClick={onSOS}
              className="w-32 h-32 bg-red-600 text-white rounded-full flex items-center justify-center border-4 border-[#E0E5EC] nm-raised cursor-pointer animate-pulse relative hover:scale-105 transition-transform"
            >
              <div className="absolute inset-0 bg-red-500 rounded-full animate-wave pointer-events-none" />
              <span className="text-xl font-display font-black tracking-widest relative z-10" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>SOS</span>
            </button>

            <p className="text-xs text-[#636E72] mt-4 px-4 leading-relaxed font-semibold">
              Tap the red circle to broadcast an emergency signal. System sends location, last 30 seconds crash loop clip, and vehicle ID to municipal emergency dispatchers.
            </p>
          </div>

          {/* Nearest Hospitals */}
          <div className="nm-raised rounded-[24px] p-5 text-left">
            <h3 className="text-xs font-bold text-slate-800 font-mono tracking-wider uppercase flex items-center space-x-1.5 mb-3">
              <HeartPulse className="w-4 h-4 text-red-500" />
              <span>NEAREST TRAUMA CARE & EMERGENCY SERVICES</span>
            </h3>

            <div className="space-y-3">
              {[
                { name: '🏥 Asansol District Trauma Center', distance: '1.2 km away', phone: '+91 341 220 1234' },
                { name: '🏥 NH Highway Emergency Post 22', distance: '4.5 km away', phone: '1033 (Toll Free)' },
                { name: '👮 GT Road Police Station', distance: '1.8 km away', phone: '112 / 100' }
              ].map((hosp, i) => (
                <div key={i} className="p-3 nm-inset rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800">{hosp.name}</h4>
                    <p className="text-[10px] text-[#636E72] font-mono mt-0.5">{hosp.distance}</p>
                  </div>
                  
                  <a 
                    href={`tel:${hosp.phone}`} 
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center shadow"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SOS COUNTDOWN OVERLAY TRIGGER SCREEN */}
      {showSosOverlay && (
        <div className="fixed inset-0 z-50 bg-red-600/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="max-w-md w-full space-y-6">
            <div className="w-32 h-32 bg-white text-red-600 rounded-full flex items-center justify-center text-5xl font-display font-black mx-auto shadow-2xl relative">
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-25" />
              <span>{sosCountdown}</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-display font-black tracking-wide">SOS EMERGENCY DECLARED</h2>
              <p className="text-sm opacity-90 px-4 leading-relaxed">
                Broadcasting GPS coordinates, vehicle profile registration, and 30-seconds crash evidence clips to safety response portals.
              </p>
            </div>

            <button 
              onClick={cancelSOS}
              className="px-8 py-3.5 bg-white text-red-600 font-black text-xs tracking-wider uppercase rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
            >
              ✕ CANCEL EMERGENCY DISPATCH
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
