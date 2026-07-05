import React, { useState, useEffect } from 'react';
import { 
  Shield, Eye, Gauge, Car, AlertTriangle, Check, MapPin, 
  Wrench, Users, Building2, Bell, ShieldAlert, Zap, Radio, 
  Map, List, PlusCircle, HelpCircle, Activity, Award, LogOut, Phone, Settings,
  Mic, MicOff, Sun, Moon, ChevronLeft
} from 'lucide-react';

import { Role, VehicleSetup, Hazard, AlertLog, DrivingStats, SavedClip, CommunityReport } from './types';
import SplashOnboarding from './components/SplashOnboarding';
import DrivingHome from './components/DrivingHome';
import { DriverMonitoring, LaneDetection, TrafficSignRecognition, CollisionWarning } from './components/AdasModules';
import { RoadHazardDetection, DrivingScore, TripHistory } from './components/RiskHabits';
import MaintenanceRecording from './components/MaintenanceRecording';
import GeospatialCivic from './components/GeospatialCivic';
import SettingsScreen from './components/SettingsScreen';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('rg_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('rg_theme', next);
  };

  const [setupCompleted, setSetupCompleted] = useState(false);
  const [role, setRole] = useState<Role>('driver');
  const [vehicle, setVehicle] = useState<VehicleSetup>({
    type: 'car_suv',
    registration: 'DL3CAY9821',
    makeModel: 'Hyundai Creta',
    year: 2023,
    fuelType: 'Petrol'
  });

  // Global Active Navigation Tab for Driver View
  const [activeTab, setActiveTab] = useState<'driving' | 'adas' | 'habits' | 'maintenance' | 'geospatial' | 'settings'>('driving');

  // Adas Module Subtabs
  const [adasSubTab, setAdasSubTab] = useState<'drowsy' | 'lane' | 'signs' | 'collision'>('drowsy');
  // Risk Habits Subtabs
  const [habitsSubTab, setHabitsSubTab] = useState<'hazards' | 'score' | 'history'>('hazards');

  // SIMULATOR REAL-TIME STATES
  const [isSimulating, setIsSimulating] = useState(false);
  const [stats, setStats] = useState<DrivingStats>({
    speed: 42,
    distance: 2.3,
    score: 87,
    activeHazards: 1,
    durationSeconds: 154,
    hardBrakes: 0,
    laneDepartures: 0,
    drowsyEvents: 0,
    speedViolations: 0
  });

  // Chronological Alerts Log
  const [alerts, setAlerts] = useState<AlertLog[]>([
    { id: '1', timestamp: '10:45 AM', type: 'wrong_way', message: '⚠️ Wrong-way vehicle detected 50m ahead!', severity: 'critical', speed: 52, location: 'NH-19 Highway', hasVideo: true }
  ]);

  // Video Evidence loop archives
  const [clips, setClips] = useState<SavedClip[]>([
    { id: 'c1', title: 'Wrong-way Vehicle Danger Loop', severity: 'critical', location: 'NH-19, Near Asansol', time: '10:45 AM', speed: 52, duration: '20s' }
  ]);

  // Active Simulated Hazards ahead
  const [activeHazards, setActiveHazards] = useState<Hazard[]>([
    { id: 'h1', type: 'wrong_way', name: 'Wrong-way Vehicle', severity: 'critical', distance: 50, confidence: 96, timestamp: '10:45 AM', location: 'NH-19 Highway', lat: 23.6889, lng: 86.9749 }
  ]);

  // Civic Community Reports submitted
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>([
    { id: 'rep1', type: 'Large Pothole', severity: 'high', location: 'NH-19 Bypass, Near Durgapur', timestamp: 'Yesterday, 4:20 PM', status: 'Acknowledged', description: 'Deep, multi-lane road surface depression. High alignment risk.', responseMessage: 'Works division crew dispatched for asphalt resurfacing on Monday.' }
  ]);

  // Emergency SOS overlays trigger
  const [showSosOverlay, setShowSosOverlay] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSosOverlay && sosCountdown > 0) {
      timer = setInterval(() => {
        setSosCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
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

  // Web Speech API / Hands-free speech control
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [lastExecutedCommand, setLastExecutedCommand] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!voiceActive) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Voice command assistant started');
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptStr = event.results[current][0].transcript.trim().toLowerCase();
      setVoiceTranscript(transcriptStr);

      if (transcriptStr.includes('report pothole')) {
        setLastExecutedCommand('Report pothole');
        triggerCustomEvent('pothole');
        submitCommunityReport({
          type: 'Large Pothole',
          severity: 'high',
          location: 'Voice Command Captured Location',
          description: 'Hands-free voice reported pothole.'
        });
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SpeechSynthesisUtterance("Pothole reported at your current location. Alerts and civic systems updated."));
        }
      } else if (transcriptStr.includes('check status')) {
        setLastExecutedCommand('Check status');
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const report = `Vehicle safety status is ${stats.score} percent. Speed is ${stats.speed} kilometers per hour. System fully operational.`;
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(report));
        }
      } else if (transcriptStr.includes('activate sos') || transcriptStr.includes('emergency sos') || transcriptStr.includes('activate s.o.s.')) {
        setLastExecutedCommand('Activate SOS');
        handleSOS();
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SpeechSynthesisUtterance("SOS emergency sequence triggered. Initiating five second countdown."));
        }
      }
    };

    recognition.onerror = (err: any) => {
      console.error('Speech recognition error:', err);
    };

    recognition.onend = () => {
      if (voiceActive) {
        try {
          recognition.start();
        } catch (e) {
          console.error('Failed to restart speech recognition:', e);
        }
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
    }

    return () => {
      recognition.onend = null;
      try {
        recognition.stop();
      } catch (e) {
        console.error(e);
      }
    };
  }, [voiceActive, stats.score, stats.speed]);

  const toggleVoiceMode = () => {
    const nextState = !voiceActive;
    setVoiceActive(nextState);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (nextState) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Hands free voice assistant activated. You can say: report pothole, check status, or activate SOS."));
      } else {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Voice assistant deactivated."));
      }
    }
  };

  // Quick Action: Add alert log item
  const addAlert = (newAlert: Omit<AlertLog, 'id' | 'timestamp'>) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const item: AlertLog = {
      ...newAlert,
      id: Math.random().toString(),
      timestamp: timeString
    };
    setAlerts(prev => [item, ...prev]);
  };

  // Quick Action: Add video clip evidence
  const addClip = (newClip: SavedClip) => {
    setClips(prev => [newClip, ...prev]);
  };

  const removeClip = (id: string) => {
    setClips(prev => prev.filter(c => c.id !== id));
  };

  // Submit community report
  const submitCommunityReport = (newReport: Omit<CommunityReport, 'id' | 'timestamp' | 'status'>) => {
    const timeString = new Date().toLocaleDateString([], { day: 'numeric', month: 'short' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const item: CommunityReport = {
      ...newReport,
      id: Math.random().toString(),
      timestamp: timeString,
      status: 'Pending'
    };
    setCommunityReports(prev => [item, ...prev]);
  };

  // Trigger Custom Simulated Event
  const triggerCustomEvent = (eventType: string) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (eventType === 'wrong_way') {
      // Add Wrong-way driver
      const newHazard: Hazard = {
        id: Math.random().toString(),
        type: 'wrong_way',
        name: 'Wrong-Way Vehicle',
        severity: 'critical',
        distance: 50,
        confidence: 94,
        timestamp: timeString,
        location: vehicle.makeModel + ' Route',
        lat: 23.6892,
        lng: 86.9752
      };
      setActiveHazards(prev => [newHazard, ...prev]);
      addAlert({
        type: 'wrong_way',
        message: '🚨 CRITICAL: Wrong-way Vehicle detected ahead!',
        severity: 'critical',
        speed: stats.speed,
        location: 'NH-19 Bypass',
        hasVideo: true
      });
      addClip({
        id: Math.random().toString(),
        title: 'Wrong-way Vehicle Detection Clip',
        severity: 'critical',
        location: 'NH-19 Bypass',
        time: timeString,
        speed: stats.speed,
        duration: '20s'
      });
      setStats(prev => ({
        ...prev,
        score: Math.max(40, prev.score - 10),
        activeHazards: prev.activeHazards + 1
      }));
    }

    else if (eventType === 'pothole') {
      // Add Pothole
      const newHazard: Hazard = {
        id: Math.random().toString(),
        type: 'pothole',
        name: 'Large Pothole',
        severity: 'high',
        distance: 40,
        confidence: 89,
        timestamp: timeString,
        location: 'City Main Road',
        lat: 23.6901,
        lng: 86.9765
      };
      setActiveHazards(prev => [newHazard, ...prev]);
      addAlert({
        type: 'pothole',
        message: '🔴 HIGH: Large Pothole 40 meters ahead. Slow down!',
        severity: 'high',
        speed: stats.speed,
        location: 'City Road Stretch',
        hasVideo: false
      });
      setStats(prev => ({
        ...prev,
        hardBrakes: prev.hardBrakes + 1,
        score: Math.max(40, prev.score - 4),
        activeHazards: prev.activeHazards + 1
      }));
    }

    else if (eventType === 'drowsy') {
      // Drowsy fatigue event
      addAlert({
        type: 'drowsy',
        message: '😴 WARNING: Driver drowsiness / eyes closing detected!',
        severity: 'critical',
        speed: stats.speed,
        location: 'Chassis Inner Cabin',
        hasVideo: true
      });
      addClip({
        id: Math.random().toString(),
        title: 'Driver Attention Fatigue Event',
        severity: 'critical',
        location: 'Cabin Camera',
        time: timeString,
        speed: stats.speed,
        duration: '15s'
      });
      setStats(prev => ({
        ...prev,
        drowsyEvents: prev.drowsyEvents + 1,
        score: Math.max(30, prev.score - 8)
      }));
    }

    else if (eventType === 'lane_drift') {
      // Lane departure drift
      addAlert({
        type: 'lane_drift',
        message: '🛣️ CAUTION: Lane departure drift detected without indicator!',
        severity: 'medium',
        speed: stats.speed,
        location: 'Highway Lane Drift',
        hasVideo: false
      });
      setStats(prev => ({
        ...prev,
        laneDepartures: prev.laneDepartures + 1,
        score: Math.max(50, prev.score - 3)
      }));
    }

    else if (eventType === 'speed_sign') {
      // Speed Limit sign scanning
      addAlert({
        type: 'speed_sign',
        message: '🟢 INFO: Speed Limit sign scanned: limit 60 km/h',
        severity: 'low',
        speed: stats.speed,
        location: 'Highway Signboard',
        hasVideo: false
      });
      setStats(prev => ({
        ...prev,
        speedViolations: prev.speedViolations + 1,
        speed: 68 // speed up to simulate overspeed limits
      }));
    }
  };

  // SOS Emergency trigger callbacks
  const handleSOS = () => {
    setShowSosOverlay(true);
  };

  const cancelSOS = () => {
    setShowSosOverlay(false);
  };

  // Handle completion of setup Wizard
  const handleSetupComplete = (selectedRole: Role, configuredVehicle: VehicleSetup) => {
    setRole(selectedRole);
    setVehicle(configuredVehicle);
    setSetupCompleted(true);
  };

  // Reset User session
  const handleLogout = () => {
    setSetupCompleted(false);
    setIsSimulating(false);
  };

  // 1. Wizard Setup Onboarding Screens
  if (!setupCompleted) {
    return (
      <div className={`min-h-screen transition-colors duration-300 theme-${theme} bg-[var(--bg-app)] text-[var(--text-primary)]`}>
        {/* Floating Theme Toggle during Onboarding */}
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 nm-raised hover:nm-inset rounded-full transition-all flex items-center justify-center cursor-pointer shadow-lg"
            title={theme === 'dark' ? "Switch to Light Neumorphic Mode" : "Switch to Dark Polish Mode"}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
          </button>
        </div>
        <SplashOnboarding onComplete={handleSetupComplete} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 theme-${theme} bg-[var(--bg-app)] text-[var(--text-primary)] font-sans`}>
      
      {/* GLOBAL HIGH-POLISH DESKTOP HEADER & UTILITY BAR */}
      <header className="px-6 py-4 nm-raised flex justify-between items-center sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center space-x-3 text-left">
          <div className="w-10 h-10 nm-inset rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-display font-black tracking-tight leading-none text-[var(--text-primary)]">
              Road<span className="text-emerald-500 dark:text-emerald-400">Guardian</span> AI
            </h1>
            <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mt-0.5">
              COMPLETE VEHICLE SAFETY ECOSYSTEM • ROLE: {role.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Diagnostic and Vehicle Quick Specs */}
        <div className="hidden md:flex items-center space-x-3 text-xs font-mono">
          <div className="px-3.5 py-1.5 nm-inset rounded-full text-[var(--text-muted)] flex items-center space-x-1.5">
            <Radio className={`w-3 h-3 ${isSimulating ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
            <span>OBD: {isSimulating ? 'ACTIVE STREAM' : 'STANDBY'}</span>
          </div>
          <div className="px-3.5 py-1.5 nm-inset rounded-full text-[var(--text-muted)]">
            🚙 {vehicle.makeModel} ({vehicle.registration})
          </div>
          
          {/* THEME TOGGLE BUTTON */}
          <button 
            onClick={toggleTheme}
            className="p-2 nm-raised hover:nm-inset rounded-full transition-all cursor-pointer flex items-center justify-center text-[var(--text-primary)]"
            title={theme === 'dark' ? "Switch to Light Neumorphic Mode" : "Switch to Dark Polish Mode"}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>

          <button 
            onClick={handleLogout}
            className="p-2 nm-raised hover:nm-inset text-red-500 hover:text-red-400 rounded-full transition-all cursor-pointer flex items-center justify-center"
            title="Switch Profile / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* CORE CONTENT LAYOUT GRID (Adaptive bento structure) */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        
        {/* ROLE 1: INDIVIDUAL DRIVER FLOW (CORE APP ASSISTANCE TABS) */}
        {role === 'driver' && (
          <>
            {/* VOICE COMMAND HUD BAR */}
            <div className="mb-6 p-4 nm-raised rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-[#1F2937] bg-[#0F1117] relative overflow-hidden">
              <div className="flex items-center space-x-3 text-left w-full md:w-auto">
                <button
                  onClick={toggleVoiceMode}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    voiceActive 
                      ? 'bg-red-600/20 border border-red-500 text-red-400 animate-pulse' 
                      : 'bg-[#161922] border border-[#1F2937] text-gray-400 hover:text-white'
                  }`}
                  title={voiceActive ? "Disable Hands-Free Mode" : "Enable Hands-Free Mode"}
                >
                  {voiceActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Hands-Free Voice Assistant</span>
                    {voiceActive ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950/40 border border-red-800 text-red-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                        LISTENING ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#111827] border border-[#1F2937] text-gray-500">
                        STANDBY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Say <span className="text-emerald-400 font-semibold font-mono">"Report pothole"</span>, <span className="text-emerald-400 font-semibold font-mono">"Check status"</span>, or <span className="text-emerald-400 font-semibold font-mono">"Activate SOS"</span> hands-free.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-start md:justify-end">
                {/* Last Heard/Command Status */}
                <div className="text-left md:text-right font-mono text-xs">
                  <span className="text-[10px] uppercase text-gray-500 tracking-wider font-bold block">Voice Log</span>
                  {voiceTranscript ? (
                    <span className="text-gray-300">Heard: "{voiceTranscript}"</span>
                  ) : (
                    <span className="text-gray-500 italic">No audio input yet</span>
                  )}
                </div>
                
                {lastExecutedCommand && (
                  <div className="px-3 py-1 bg-emerald-950/40 border border-emerald-800 text-emerald-400 rounded-lg text-xs font-mono animate-pulse">
                    Executed: {lastExecutedCommand}
                  </div>
                )}

                {!speechSupported && (
                  <div className="text-red-400 text-xs font-bold bg-red-950/20 px-3 py-1.5 rounded-lg border border-red-800">
                    Web Speech API unsupported on this browser
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Nav menu (collapses beautifully into horizontal strip on mobile) */}
            <div className="lg:col-span-3 flex flex-row lg:flex-col p-2 nm-inset rounded-3xl lg:space-y-3 space-x-2 lg:space-x-0 overflow-x-auto">
              {[
                { id: 'driving', label: '🏠 CORE HUD', icon: <Car className="w-4 h-4" /> },
                { id: 'adas', label: '🛡️ ADAS AI', icon: <Gauge className="w-4 h-4" /> },
                { id: 'habits', label: '📊 RISK HABITS', icon: <Activity className="w-4 h-4" /> },
                { id: 'maintenance', label: '🔧 MAINTENANCE', icon: <Wrench className="w-4 h-4" /> },
                { id: 'geospatial', label: '🗺️ MAP & CIVIC', icon: <Map className="w-4 h-4" /> },
                { id: 'settings', label: '⚙️ SETTINGS', icon: <Settings className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-none lg:flex items-center lg:space-x-3 px-4 py-3 text-xs font-bold rounded-2xl transition-all ${
                    activeTab === tab.id 
                      ? 'nm-raised text-blue-600 font-extrabold border-r-2 lg:border-r-4 border-blue-600' 
                      : 'text-[#636E72] hover:text-[#2D3436] hover:nm-inset'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-1.5 lg:ml-0">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Central Display Canvas */}
            <div className="lg:col-span-9 transition-all">
              {activeTab === 'driving' && (
                <DrivingHome 
                  stats={stats} 
                  setStats={setStats} 
                  alerts={alerts} 
                  addAlert={addAlert} 
                  activeHazards={activeHazards} 
                  triggerCustomEvent={triggerCustomEvent}
                  isSimulating={isSimulating}
                  setIsSimulating={setIsSimulating}
                  onSOS={handleSOS}
                />
              )}

              {activeTab === 'adas' && (
                <div className="space-y-6">
                  {/* ADAS MODULE SUBTABS HEADER */}
                  <div className="flex p-1 nm-inset rounded-2xl justify-between">
                    {[
                      { id: 'drowsy', label: '👁️ Gaze attention' },
                      { id: 'lane', label: '🛣️ Lane departure' },
                      { id: 'signs', label: '🛑 Traffic signs' },
                      { id: 'collision', label: '🚗 Forward Radar' }
                    ].map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setAdasSubTab(sub.id as any)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${adasSubTab === sub.id ? 'nm-raised text-blue-600' : 'text-[#636E72] hover:text-[#2D3436]'}`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  {adasSubTab === 'drowsy' && <DriverMonitoring stats={stats} alerts={alerts} />}
                  {adasSubTab === 'lane' && <LaneDetection stats={stats} alerts={alerts} />}
                  {adasSubTab === 'signs' && <TrafficSignRecognition stats={stats} alerts={alerts} />}
                  {adasSubTab === 'collision' && <CollisionWarning stats={stats} alerts={alerts} />}
                </div>
              )}

              {activeTab === 'habits' && (
                <div className="space-y-6">
                  {/* HABITS SUBTABS */}
                  <div className="flex p-1 nm-inset rounded-2xl justify-between">
                    {[
                      { id: 'hazards', label: '🕳️ Route hazards' },
                      { id: 'score', label: '📈 Diagnostics Rank' },
                      { id: 'history', label: '📅 Previous trips' }
                    ].map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setHabitsSubTab(sub.id as any)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${habitsSubTab === sub.id ? 'nm-raised text-blue-600' : 'text-[#636E72] hover:text-[#2D3436]'}`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  {habitsSubTab === 'hazards' && <RoadHazardDetection activeHazards={activeHazards} onReportClick={() => setActiveTab('geospatial')} />}
                  {habitsSubTab === 'score' && <DrivingScore stats={stats} setStats={setStats} />}
                  {habitsSubTab === 'history' && <TripHistory stats={stats} />}
                </div>
              )}

              {activeTab === 'maintenance' && (
                <MaintenanceRecording 
                  stats={stats} 
                  clips={clips} 
                  addClip={addClip} 
                  removeClip={removeClip} 
                />
              )}

              {activeTab === 'geospatial' && (
                <GeospatialCivic 
                  alerts={alerts}
                  addAlert={addAlert}
                  activeHazards={activeHazards}
                  communityReports={communityReports}
                  submitCommunityReport={submitCommunityReport}
                  onSOS={handleSOS}
                  showSosOverlay={showSosOverlay}
                  cancelSOS={cancelSOS}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsScreen role={role} vehicle={vehicle} onLogout={handleLogout} />
              )}
            </div>

          </div>
        </>
      )}

        {/* ROLE 2: FLEET ADMINISTRATOR VIEW */}
        {role === 'fleet' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center space-x-3 mb-2">
              <button 
                onClick={handleLogout}
                className="p-2 nm-raised hover:nm-inset rounded-full transition-all text-[var(--text-primary)]"
                title="Go Back to Setup"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono font-bold text-blue-500 uppercase tracking-wider">FLEET MANAGER PORTAL</span>
            </div>

            <div className="p-6 nm-raised rounded-[28px] bg-[var(--bg-app)] border border-blue-500/10">
              <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">Fleet Operations Dashboard</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Comparative logs, active routes, telemetry anomalies, and safe driving diagnostic ranks for connected vehicles.
              </p>
            </div>

            {/* Comparative grid highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'ACTIVE CONNECTED SHIFTS', value: '18 Vehicles Live', color: 'text-blue-500' },
                { label: 'FLEET SAFETY COEF.', value: '91% Compliance', color: 'text-emerald-500' },
                { label: 'CRITICAL HAZARDS REPORTED', value: '4 On-Road Obstacles', color: 'text-red-500' }
              ].map((kpi, idx) => (
                <div key={idx} className="p-5 nm-raised rounded-2xl bg-[var(--bg-app)]">
                  <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] block">{kpi.label}</span>
                  <span className={`text-xl font-display font-black mt-1 block ${kpi.color}`}>{kpi.value}</span>
                </div>
              ))}
            </div>

            {/* Interactive Fleet Table */}
            <div className="nm-raised rounded-[28px] p-6 bg-[var(--bg-app)]">
              <h3 className="text-sm font-bold font-mono text-[var(--text-muted)] uppercase mb-4">
                ● CONNECTED SHIFTS STATUS MATRIX
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="border-b border-[#A3B1C6]/30 text-[var(--text-muted)]">
                      <th className="pb-3 uppercase">VEHICLE ID</th>
                      <th className="pb-3 uppercase">DRIVER</th>
                      <th className="pb-3 uppercase">CURRENT SPEED</th>
                      <th className="pb-3 uppercase">SAFETY SCORE</th>
                      <th className="pb-3 uppercase">ACTIVE ALERTS</th>
                      <th className="pb-3 uppercase">LAST POSITION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#A3B1C6]/15">
                    {[
                      { reg: 'DL3CAY9821', driver: 'Rajesh Kumar (You)', speed: `${stats.speed} km/h`, score: `${stats.score} pts`, alerts: `${alerts.length} logged`, loc: 'NH-19 Bypass' },
                      { reg: 'MH12QZ4321', driver: 'Vikram Singh', speed: '55 km/h', score: '94 pts', alerts: '0', loc: 'Pune expressway' },
                      { reg: 'KA03MX9011', driver: 'Sunita Rao', speed: '0 km/h', score: '88 pts', alerts: '0', loc: 'Indiranagar Main St' },
                      { reg: 'WB20PP6543', driver: 'Amitabha Sen', speed: '72 km/h', score: '74 pts', alerts: '2 speed warns', loc: 'Kolkata Durgapur exp' }
                    ].map((row, i) => (
                      <tr key={i} className="text-[var(--text-primary)]">
                        <td className="py-3.5 font-bold text-blue-500">{row.reg}</td>
                        <td className="py-3.5 font-sans font-semibold text-[var(--text-primary)]">{row.driver}</td>
                        <td className="py-3.5 font-bold text-[var(--text-primary)]">{row.speed}</td>
                        <td className="py-3.5 font-bold text-emerald-500">{row.score}</td>
                        <td className="py-3.5 font-bold text-red-500">{row.alerts}</td>
                        <td className="py-3.5 text-[var(--text-muted)]">{row.loc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Safety Coach Action buttons */}
            <div className="p-4 nm-raised rounded-2xl flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20">
              <div>
                <h4 className="text-xs font-bold text-emerald-500">Safety Compliance verified</h4>
                <p className="text-[10px] text-[var(--text-muted)]">All connected fleet sessions currently keep scores above established safety limits (70%).</p>
              </div>
              <button onClick={() => alert('Safe driving incentive reports exported to PDF!')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95">
                EXPORT DRIVER DATA
              </button>
            </div>
          </div>
        )}

        {/* ROLE 3: MUNICIPAL AUTHORITY FLOW */}
        {role === 'authority' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center space-x-3 mb-2">
              <button 
                onClick={handleLogout}
                className="p-2 nm-raised hover:nm-inset rounded-full transition-all text-[var(--text-primary)]"
                title="Go Back to Setup"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono font-bold text-purple-500 uppercase tracking-wider">CIVIC AUTHORITY PORTAL</span>
            </div>

            <div className="p-6 nm-raised rounded-[28px] bg-[var(--bg-app)] border border-purple-500/10">
              <h2 className="text-2xl font-display font-bold text-purple-500">Municipal Road Works Portal (ULB)</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Review civic pothole/barrier reports, dispatch asphalt repair work crews, and check safety heating clusters.
              </p>
            </div>

            {/* Quick Actions and Heatmaps */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Tickets Queue */}
              <div className="lg:col-span-7 space-y-4">
                <div className="nm-raised rounded-[28px] p-6 bg-[var(--bg-app)]">
                  <h3 className="text-sm font-bold font-mono text-[var(--text-muted)] uppercase mb-4">
                    ● UNRESOLVED ROAD DEFECT REPORTS CLASSIFICATION
                  </h3>

                  <div className="space-y-3">
                    {communityReports.map(rep => (
                      <div key={rep.id} className="p-4.5 nm-inset rounded-2xl space-y-3 bg-[var(--bg-app)]">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-[var(--text-primary)] uppercase flex items-center space-x-2">
                              <span>{rep.type}</span>
                              <span className="text-[8px] font-mono bg-red-500/10 text-red-500 border border-red-500/20 px-2 rounded-full">
                                {rep.severity.toUpperCase()}
                              </span>
                            </h4>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">📍 {rep.location} • Submitted: {rep.timestamp}</p>
                          </div>

                          <span className={`text-[8px] font-mono font-black px-2.5 py-1 rounded-lg ${
                            rep.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {rep.status.toUpperCase()}
                          </span>
                        </div>

                        {rep.description && (
                          <p className="text-xs text-[var(--text-primary)] bg-[var(--bg-app)] p-2.5 rounded-lg border border-[#A3B1C6]/30 nm-inset">
                            {rep.description}
                          </p>
                        )}

                        {/* Dispatch Simulator action button */}
                        {rep.status !== 'Resolved' && (
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => {
                                // Simulate dispatching crew
                                setCommunityReports(prev => prev.map(r => r.id === rep.id ? {
                                  ...r,
                                  status: 'Resolved',
                                  responseMessage: 'Works division crew dispatched. defect patched and resurfaced.'
                                } : r));
                                if ('speechSynthesis' in window) {
                                  window.speechSynthesis.speak(new SpeechSynthesisUtterance("Asphalt maintenance crew dispatch sequence activated. Ticket resolved."));
                                }
                              }}
                              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                            >
                              🚀 DISPATCH WORKS REPAIR CREW
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Heatmap Mini panel */}
              <div className="lg:col-span-5 space-y-4">
                <div className="nm-raised rounded-[28px] p-6 space-y-4 bg-[var(--bg-app)]">
                  <h3 className="text-sm font-bold font-mono text-[var(--text-muted)] uppercase">
                    ● URBAN ACCIDENT HAZARD HEATMAPS
                  </h3>
                  
                  {/* Simulated heatmap circles */}
                  <div className="h-56 nm-inset rounded-2xl bg-[var(--bg-app)] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                    <div className="absolute w-36 h-36 bg-red-500/10 rounded-full filter blur-xl animate-pulse" />
                    <span className="text-red-500 font-mono font-black text-xs relative z-10 block mb-1">
                      🚨 AREA CLUSTER RED GLOW: HIGH RISK
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] relative z-10 leading-snug">
                      NH-19 corridor has logged 34 pothole alerts and 2 wrong-way driver warnings this month. High friction patch wear recommended.
                    </span>
                  </div>

                  <div className="p-4 nm-inset rounded-xl text-xs font-semibold text-[var(--text-muted)]">
                    Municipal Safety Index: <strong className="text-[var(--text-primary)]">72/100 (Needs Improvement)</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ROLE 4: EXPERT VEHICLE MECHANIC VIEW */}
        {role === 'mechanic' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center space-x-3 mb-2">
              <button 
                onClick={handleLogout}
                className="p-2 nm-raised hover:nm-inset rounded-full transition-all text-[var(--text-primary)]"
                title="Go Back to Setup"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">DIAGNOSTIC MECHANIC PORTAL</span>
            </div>

            <div className="p-6 nm-raised rounded-[28px] bg-[var(--bg-app)] border border-amber-500/10">
              <h2 className="text-2xl font-display font-bold text-amber-500">ADAS Maintenance Calibration Console</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Analyze direct sensor wear coefficients, stress telemetry variables, and diagnostic fault log histories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Side: Diagnostics and sliders */}
              <div className="nm-raised rounded-[28px] p-6 space-y-4 bg-[var(--bg-app)]">
                <h3 className="text-sm font-bold font-mono text-[var(--text-muted)] uppercase">
                  ● ACTIVE SENSOR PITCH & CALIBRATION WEAR DIALS
                </h3>

                <div className="space-y-3">
                  {[
                    { name: 'Accelerometers Drift Coefficient', val: '0.04 m/s² (Stable)' },
                    { name: 'Pitch/Yaw Orientation Horizon Angle', val: '0.12° pitch (Calibrated)' },
                    { name: 'Brake Pad wear multiplier coeff.', val: '1.45x (High Brake)' },
                    { name: 'Suspension Rough Road stress factor', val: '1.23x (Rough Surface)' }
                  ].map((diag, i) => (
                    <div key={i} className="p-3.5 nm-inset rounded-xl flex justify-between text-xs font-mono bg-[var(--bg-app)]">
                      <span className="text-[var(--text-muted)]">{diag.name}</span>
                      <span className="font-bold text-[var(--text-primary)]">{diag.val}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => alert('Sensor pitch reset successfully! Accelerometer values zeroed.')}
                  className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-app)] font-bold text-xs rounded-xl shadow-md hover:opacity-90 transition-all active:scale-95"
                >
                  ZERO ACCELEROMETER GYRO DRIFT
                </button>
              </div>

              {/* Right Side: Maintenance items Status list */}
              <div className="nm-raised rounded-[28px] p-6 bg-[var(--bg-app)]">
                <h3 className="text-sm font-bold font-mono text-[var(--text-muted)] uppercase mb-4">
                  ● TELEMETRY PREDICTIVE PARTS ANALYSIS
                </h3>

                <div className="space-y-3">
                  {[
                    { part: 'Brake Pads Friction Material', wear: '45%', status: 'Monitor (Check within 500km)' },
                    { part: 'Front Left Shock Absorber', wear: '68%', status: 'Good' },
                    { part: 'Front Right Shock Absorber', wear: '67%', status: 'Good' },
                    { part: 'Tire Tread Depth Coefficient', wear: '34%', status: 'Service Soon (Alignment Drift)' }
                  ].map((partItem, idx) => (
                    <div key={idx} className="p-4 nm-inset rounded-xl text-xs space-y-1 bg-[var(--bg-app)]">
                      <div className="flex justify-between font-bold">
                        <span className="text-[var(--text-primary)]">{partItem.part}</span>
                        <span className="text-blue-500 font-mono">{partItem.wear}</span>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] font-semibold">Status: {partItem.status}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ROLE 5: CO-PASSENGER COMPANION FLOW */}
        {role === 'passenger' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center space-x-3 mb-2">
              <button 
                onClick={handleLogout}
                className="p-2 nm-raised hover:nm-inset rounded-full transition-all text-[var(--text-primary)]"
                title="Go Back to Setup"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono font-bold text-pink-500 uppercase tracking-wider">CO-PASSENGER CO-PILOT PORTAL</span>
            </div>

            <div className="p-6 nm-raised rounded-[28px] bg-[var(--bg-app)] border border-pink-500/10">
              <h2 className="text-2xl font-display font-bold text-pink-500">Co-Passenger Safety Portal</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                View synced real-time ADAS alerts, broadcast vehicle coordinates links, or trigger manual SOS emergency alarms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Sycned Map coordinates card */}
              <div className="nm-raised rounded-[28px] p-6 space-y-4 bg-[var(--bg-app)]">
                <h3 className="text-sm font-bold font-mono text-[var(--text-muted)] uppercase">
                  ● LIVE TRIP METRICS CO-PILOT VIEW
                </h3>

                <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
                  <div className="p-3.5 nm-inset rounded-xl bg-[var(--bg-app)]">
                    <span className="text-[var(--text-muted)] block">CURRENT SPEED</span>
                    <span className="text-xl font-display font-black text-[var(--text-primary)] mt-1 block">{stats.speed} km/h</span>
                  </div>
                  <div className="p-3.5 nm-inset rounded-xl bg-[var(--bg-app)]">
                    <span className="text-[var(--text-muted)] block">TRIP SAFE INDEX</span>
                    <span className="text-xl font-display font-black text-emerald-500 mt-1 block">{stats.score}/100</span>
                  </div>
                </div>

                <div className="p-4 nm-inset rounded-2xl flex items-center space-x-3 text-xs text-[var(--text-muted)] bg-[var(--bg-app)]">
                  <MapPin className="w-6 h-6 text-pink-500 animate-pulse" />
                  <div>
                    <span className="font-bold text-[var(--text-primary)] block">Active Coordinates Broadcast</span>
                    <span>Broadcasting live location: 23.6889° N, 86.9749° E</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert('Secure co-passenger location link copied! Share with emergency guardians.')}
                  className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  📤 BROADCAST REAL-TIME LOCATION LINK
                </button>
              </div>

              {/* Big passenger SOS screen */}
              <div className="nm-raised rounded-[28px] p-6 flex flex-col items-center justify-center text-center bg-[var(--bg-app)]">
                <h3 className="text-sm font-bold font-mono text-red-500 uppercase mb-4">
                  ● INSTANT PASSENGER EMERGENCY TRIPPERS
                </h3>

                <button 
                  onClick={handleSOS}
                  className="w-28 h-28 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center border-4 border-[var(--text-primary)] shadow-lg cursor-pointer animate-pulse transition-all active:scale-95"
                >
                  <span className="text-lg font-display font-black tracking-widest text-white">SOS</span>
                </button>

                <p className="text-xs text-[var(--text-muted)] mt-4 px-4 leading-relaxed font-semibold">
                  Passenger has full sovereign authority to trigger emergency distress loops. Instantly alerts municipal ambulances and rescue coordinates.
                </p>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER METADATA BRANDING */}
      <footer className="py-6 border-t border-[#A3B1C6]/20 mt-12 text-center text-xs font-mono text-[#636E72] space-y-1">
        <p>🚗 ROADGUARDIAN AI • THE INTELLIGENT SAFE DRIVING COMPANION</p>
        <p className="opacity-75">TATA TECHNOLOGIES INNOVENT DEV PORTAL • SECURE OFFLINE EDGE INFRASTRUCTURE</p>
      </footer>

      {/* EMERGENCY SOS MODAL LAYER TRANSITION */}
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
