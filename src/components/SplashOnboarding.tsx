import React, { useState, useEffect } from 'react';
import { 
  Shield, Eye, Gauge, Car, AlertOctagon, Check, 
  MapPin, Bell, User, Users, Wrench, Building2, HelpCircle,
  ChevronLeft
} from 'lucide-react';
import { Role, VehicleSetup } from '../types';

interface SplashOnboardingProps {
  onComplete: (role: Role, vehicle: VehicleSetup) => void;
}

export default function SplashOnboarding({ onComplete }: SplashOnboardingProps) {
  const [step, setStep] = useState<'splash' | 'onboarding' | 'role' | 'vehicle' | 'permissions' | 'calibration'>('splash');
  const [onboardSlide, setOnboardSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Permissions State
  const [perms, setPerms] = useState({
    camera: false,
    location: false,
    microphone: false,
    notifications: false
  });

  // Vehicle Info State
  const [vehicle, setVehicle] = useState<VehicleSetup>({
    type: 'car_suv',
    registration: 'DL3CAY9821',
    makeModel: 'Hyundai Creta',
    year: 2023,
    fuelType: 'Petrol'
  });

  // Selected Role
  const [selectedRole, setSelectedRole] = useState<Role>('driver');

  // Splash Screen progress timer
  useEffect(() => {
    if (step === 'splash') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('onboarding'), 400);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Slides data
  const slides = [
    {
      title: "AI Sees Every Hazard",
      subtitle: "Potholes, wrong-way drivers, structural cracks, and waterlogging are detected in real-time on-device.",
      icon: <Eye className="w-16 h-16 text-blue-500 dark:text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />,
      color: "text-blue-500"
    },
    {
      title: "Smart Risk Intelligence",
      subtitle: "Evaluate collision risks (TTC) using high-precision monocular distance calculation before alerts bother you.",
      icon: <Gauge className="w-16 h-16 text-amber-500 dark:text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />,
      color: "text-amber-500"
    },
    {
      title: "Complete Safety Companion",
      subtitle: "Continuous driver monitoring, safety diagnostics scoring, predicted part wear, and evidence capture.",
      icon: <Shield className="w-16 h-16 text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />,
      color: "text-emerald-500"
    }
  ];

  const handleNextSlide = () => {
    if (onboardSlide < slides.length - 1) {
      setOnboardSlide(prev => prev + 1);
    } else {
      setStep('role');
    }
  };

  const submitVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('permissions');
  };

  const handleGrantPermission = (key: keyof typeof perms) => {
    setPerms(prev => ({ ...prev, [key]: true }));
    // Play a synthetic sound if supported
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${String(key)} permission granted`);
      utterance.volume = 0.5;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePermissionsComplete = () => {
    setStep('calibration');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex flex-col items-center justify-center p-4 selection:bg-blue-200 text-[var(--text-primary)]">
      
      {/* 1. SPLASH SCREEN */}
      {step === 'splash' && (
        <div className="flex flex-col items-center justify-between h-[80vh] w-full max-w-md p-6">
          <div /> {/* Spacer */}
          
          <div className="flex flex-col items-center space-y-6">
            {/* Neumorphic Shield Circle */}
            <div className="w-32 h-32 nm-raised rounded-full flex items-center justify-center relative animate-pulse">
              <div className="w-24 h-24 nm-inset rounded-full flex items-center justify-center">
                <Shield className="w-14 h-14 text-emerald-500 drop-shadow-md" />
              </div>
              {/* Outer halo */}
              <div className="absolute inset-0 border border-emerald-400/20 rounded-full animate-ping pointer-events-none" />
            </div>
            
            <h1 className="text-4xl font-display font-bold tracking-tight text-[var(--text-primary)]">
              Road<span className="text-emerald-500 dark:text-emerald-400">Guardian</span> AI
            </h1>
            <p className="text-sm font-medium text-[var(--text-muted)] tracking-wider uppercase font-mono">
              See the Road. Know the Risk. Drive Safe.
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="w-full h-4 nm-inset rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-100" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-[var(--text-muted)]">
              <span>INITIALIZING NEURAL NETS...</span>
              <span>{progress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. ONBOARDING SLIDES */}
      {step === 'onboarding' && (
        <div className="w-full max-w-md p-6 nm-raised rounded-[30px] flex flex-col justify-between h-[85vh] transition-all bg-[var(--bg-app)]">
          <div className="flex justify-between items-center">
            {onboardSlide > 0 ? (
              <button 
                onClick={() => setOnboardSlide(prev => prev - 1)}
                className="p-2 nm-raised rounded-full hover:nm-inset transition-all text-[var(--text-primary)]"
                title="Go Back"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs font-mono font-bold text-blue-600 tracking-wider">ROADGUARDIAN AI</span>
            )}
            <button 
              onClick={() => setStep('role')}
              className="text-xs font-sans font-semibold text-[var(--text-muted)] px-3 py-1.5 nm-raised rounded-full hover:nm-inset transition-all"
            >
              Skip
            </button>
          </div>

          <div className="flex flex-col items-center my-8 text-center space-y-6">
            <div className="w-32 h-32 nm-inset rounded-full flex items-center justify-center">
              <div className="w-24 h-24 nm-raised rounded-full flex items-center justify-center">
                {slides[onboardSlide].icon}
              </div>
            </div>

            <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">
              {slides[onboardSlide].title}
            </h2>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed px-4">
              {slides[onboardSlide].subtitle}
            </p>
          </div>

          <div className="space-y-6">
            {/* Dots */}
            <div className="flex justify-center space-x-2">
              {slides.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2.5 rounded-full transition-all duration-300 ${onboardSlide === i ? 'w-6 bg-blue-600 nm-inset-sm' : 'w-2.5 bg-slate-400 opacity-40 nm-raised-sm'}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button 
              onClick={handleNextSlide}
              className="w-full py-4 font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 transform"
            >
              {onboardSlide === slides.length - 1 ? "Get Started" : "Continue"}
            </button>
          </div>
        </div>
      )}

      {/* 3. ROLE SELECTION */}
      {step === 'role' && (
        <div className="w-full max-w-md p-6 nm-raised rounded-[30px] flex flex-col justify-between min-h-[85vh] bg-[var(--bg-app)]">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <button 
                onClick={() => {
                  setStep('onboarding');
                  setOnboardSlide(slides.length - 1);
                }}
                className="p-2 nm-raised rounded-full hover:nm-inset transition-all text-[var(--text-primary)]"
                title="Go Back"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-blue-600 tracking-wider">SELECT ROLE</span>
            </div>

            <h2 className="text-2xl font-display font-bold text-[var(--text-primary)] text-center mb-2">
              Choose Your Role
            </h2>
            <p className="text-sm text-[var(--text-muted)] text-center mb-6 px-4">
              Unlock dedicated user flows designed for drivers, administrators, or road inspectors.
            </p>

            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'driver', title: '🚗 Individual Driver', desc: 'Active AI driving companion, real-time alerts, safety score & parts tracking.', icon: <User className="text-emerald-500 dark:text-emerald-400" /> },
                { id: 'fleet', title: '🚌 Fleet Administrator', desc: 'Track multiple vehicles, evaluate safe driving ranks, review event cams.', icon: <Users className="text-blue-500 dark:text-blue-400" /> },
                { id: 'authority', title: '🏛️ Municipal Authority', desc: 'Access road damage maps, pothole heatmaps, direct infrastructure repair workflows.', icon: <Building2 className="text-purple-500 dark:text-purple-400" /> },
                { id: 'mechanic', title: '🔧 Expert Mechanic', desc: 'Analyze engine oil stress, brake wear predictions, and repair logging indicators.', icon: <Wrench className="text-amber-500 dark:text-amber-400" /> },
                { id: 'passenger', title: '👥 Co-Passenger View', desc: 'Real-time passenger safety monitor, map routing sync, and manual SOS trigger.', icon: <HelpCircle className="text-pink-500 dark:text-pink-400" /> }
              ].map(role => (
                <div 
                  key={role.id}
                  onClick={() => setSelectedRole(role.id as Role)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${selectedRole === role.id ? 'nm-inset border-l-4 border-blue-600' : 'nm-raised hover:nm-inset'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 nm-raised rounded-full">
                      {role.icon}
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-[var(--text-primary)]">{role.title}</h4>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{role.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => {
              if (selectedRole === 'driver' || selectedRole === 'passenger') {
                setStep('vehicle');
              } else {
                setStep('permissions');
              }
            }}
            className="w-full py-4 mt-6 font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 transform"
          >
            Continue as {selectedRole.toUpperCase()}
          </button>
        </div>
      )}

      {/* 4. VEHICLE CONFIGURATION */}
      {step === 'vehicle' && (
        <form onSubmit={submitVehicle} className="w-full max-w-md p-6 nm-raised rounded-[30px] flex flex-col justify-between min-h-[85vh] bg-[var(--bg-app)]">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <button 
                type="button"
                onClick={() => setStep('role')}
                className="p-2 nm-raised rounded-full hover:nm-inset transition-all text-[var(--text-primary)]"
                title="Go Back"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-blue-600 tracking-wider">VEHICLE CONFIG</span>
            </div>

            <h2 className="text-2xl font-display font-bold text-[var(--text-primary)] text-center mb-1">
              Vehicle Setup
            </h2>
            <p className="text-xs text-[var(--text-muted)] text-center mb-6">
              Critical for calibrating AI warning zones and maintenance calculations.
            </p>

            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-2 font-mono">VEHICLE CLASS</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'two_wheeler', label: '🏍️ Two Wheeler' },
                    { id: 'car_suv', label: '🚗 Sedan / SUV' },
                    { id: 'bus_truck', label: '🚚 Bus / Truck' },
                    { id: 'commercial', label: '🛺 Commercial Cab' }
                  ].map(vClass => (
                    <button
                      type="button"
                      key={vClass.id}
                      onClick={() => setVehicle(v => ({ ...v, type: vClass.id as any }))}
                      className={`p-3 rounded-xl font-semibold text-xs transition-all ${vehicle.type === vClass.id ? 'nm-inset text-blue-500 font-bold' : 'nm-raised text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    >
                      {vClass.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-2 font-mono">PLATE REGISTRATION</label>
                <input 
                  type="text" 
                  value={vehicle.registration}
                  onChange={e => setVehicle(v => ({ ...v, registration: e.target.value.toUpperCase() }))}
                  required
                  placeholder="e.g. DL3CAY9821"
                  className="w-full p-4 nm-inset rounded-xl text-sm font-semibold outline-none focus:text-blue-500 transition-all text-[var(--text-primary)] bg-transparent tracking-wider font-mono border border-transparent focus:border-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-2 font-mono">MAKE & MODEL</label>
                  <input 
                    type="text" 
                    value={vehicle.makeModel}
                    onChange={e => setVehicle(v => ({ ...v, makeModel: e.target.value }))}
                    required
                    placeholder="e.g. Hyundai Creta"
                    className="w-full p-4 nm-inset rounded-xl text-sm font-semibold outline-none focus:text-blue-500 transition-all text-[var(--text-primary)] bg-transparent border border-transparent focus:border-blue-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-2 font-mono">YEAR</label>
                  <input 
                    type="number" 
                    value={vehicle.year}
                    onChange={e => setVehicle(v => ({ ...v, year: parseInt(e.target.value) || 2023 }))}
                    required
                    min="2000"
                    max="2027"
                    className="w-full p-4 nm-inset rounded-xl text-sm font-semibold outline-none focus:text-blue-500 transition-all text-[var(--text-primary)] bg-transparent border border-transparent focus:border-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-2 font-mono">FUEL TYPE</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Petrol', 'Diesel', 'EV', 'CNG'].map(fuel => (
                    <button
                      type="button"
                      key={fuel}
                      onClick={() => setVehicle(v => ({ ...v, fuelType: fuel as any }))}
                      className={`p-2.5 rounded-lg text-xs font-semibold transition-all ${vehicle.fuelType === fuel ? 'nm-inset text-blue-500 font-bold' : 'nm-raised text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 mt-6 font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 transform"
          >
            Confirm Vehicle Setup
          </button>
        </form>
      )}

      {/* 5. PERMISSIONS GUIDE */}
      {step === 'permissions' && (
        <div className="w-full max-w-md p-6 nm-raised rounded-[30px] flex flex-col justify-between min-h-[85vh] bg-[var(--bg-app)]">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <button 
                type="button"
                onClick={() => {
                  if (selectedRole === 'driver' || selectedRole === 'passenger') {
                    setStep('vehicle');
                  } else {
                    setStep('role');
                  }
                }}
                className="p-2 nm-raised rounded-full hover:nm-inset transition-all text-[var(--text-primary)]"
                title="Go Back"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-blue-600 tracking-wider">PERMISSIONS</span>
            </div>

            <h2 className="text-2xl font-display font-bold text-[var(--text-primary)] text-center mb-1">
              Required Permissions
            </h2>
            <p className="text-xs text-[var(--text-muted)] text-center mb-6">
              These sensors and systems run locally on your phone to identify risks.
            </p>

            <div className="space-y-4">
              {[
                { key: 'camera' as const, title: '📷 Front & Back Camera Access', desc: 'Scans the road for potholes & traffic lights, and monitors driver drowsiness.', required: true },
                { key: 'location' as const, title: '📍 GPS Location Tracking', desc: 'Pinpoint pothole coordinates and trigger location-based speed limit thresholds.', required: true },
                { key: 'microphone' as const, title: '🎤 Microphone & Speech', desc: 'Allows emergency hands-free voice commands (\"Report pothole\", \"Call Help\").', required: false },
                { key: 'notifications' as const, title: '🔔 High Priority Alerts', desc: 'Triggers visual warnings and continuous collision warning tones in the background.', required: false }
              ].map(perm => (
                <div key={perm.key} className="p-4 nm-raised rounded-2xl flex items-center justify-between text-left">
                  <div className="max-w-[75%]">
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">
                      {perm.title} {perm.required && <span className="text-red-500 text-xs">*</span>}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1 leading-snug">{perm.desc}</p>
                  </div>
                  
                  <button
                    onClick={() => handleGrantPermission(perm.key)}
                    disabled={perms[perm.key]}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${perms[perm.key] ? 'nm-inset bg-emerald-500/10 text-emerald-500' : 'nm-raised text-blue-500 hover:text-blue-600'}`}
                  >
                    {perms[perm.key] ? <Check className="w-6 h-6 text-emerald-500" /> : <span className="text-xs font-bold">GRANT</span>}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button 
              onClick={handlePermissionsComplete}
              disabled={!perms.camera || !perms.location}
              className={`w-full py-4 font-bold text-white rounded-2xl transition-all ${(!perms.camera || !perms.location) ? 'bg-gray-400 cursor-not-allowed opacity-55 shadow-none' : 'bg-blue-600 hover:bg-blue-500 shadow-xl hover:shadow-2xl'}`}
            >
              Confirm & Continue
            </button>
            <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">
              * Camera and Location are absolutely required to activate driving HUD modules.
            </p>
          </div>
        </div>
      )}

      {/* 6. CAMERA MOUNT GUIDE & CALIBRATION */}
      {step === 'calibration' && (
        <div className="w-full max-w-md p-6 nm-raised rounded-[30px] flex flex-col justify-between min-h-[85vh] bg-[var(--bg-app)]">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <button 
                type="button"
                onClick={() => setStep('permissions')}
                className="p-2 nm-raised rounded-full hover:nm-inset transition-all text-[var(--text-primary)]"
                title="Go Back"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-blue-600 tracking-wider">ALIGNMENT</span>
            </div>

            <h2 className="text-2xl font-display font-bold text-[var(--text-primary)] text-center mb-1">
              Device Alignment
            </h2>
            <p className="text-xs text-[var(--text-muted)] text-center mb-4">
              Mount your phone in a horizontal windshield clip or dashboard cradle.
            </p>

            <div className="nm-inset rounded-2xl p-4 mb-4 text-left">
              <h4 className="text-xs font-bold text-blue-500 mb-2 font-mono">RECOMMENDED POSITION</h4>
              <ul className="text-xs text-[var(--text-muted)] space-y-2 list-disc pl-4 leading-relaxed">
                <li>Windshield center (below rearview mirror) yields 98% accuracy.</li>
                <li>Ensure rear lens is fully clear of dashboard obstructions.</li>
                <li>Calibrate your pitch angle so the road horizon meets the blue grid.</li>
              </ul>
            </div>

            {/* Simulating Calibration Grid */}
            <div className="relative h-44 bg-slate-955 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800/30">
              {/* Virtual camera field */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Sim road */}
              <div className="absolute bottom-0 w-full h-1/2 bg-slate-900 flex justify-center">
                <div className="w-8 h-full bg-yellow-400 border-dashed border-r border-l border-slate-900 opacity-80" />
              </div>

              {/* Pitch grid lines */}
              <div className="absolute w-full h-0.5 bg-blue-500 opacity-60 flex justify-between px-4 items-center">
                <span className="text-[9px] text-blue-400 font-mono -mt-3">HORIZON GRID</span>
                <span className="text-[9px] text-blue-400 font-mono -mt-3">0.0° CALIBRATED</span>
              </div>
              
              {/* Pitch Target Circle */}
              <div className="w-16 h-16 border-2 border-dashed border-emerald-400 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              </div>

              <span className="absolute top-2 left-2 text-[9px] font-mono text-emerald-400 bg-black/40 px-2 py-0.5 rounded">
                ● CALIBRATION LOCKED
              </span>
            </div>
          </div>

          <button 
            onClick={() => {
              // Finish onboarding flow!
              onComplete(selectedRole, vehicle);
            }}
            className="w-full py-4 mt-6 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 transform"
          >
            Activate RoadGuardian AI
          </button>
        </div>
      )}

    </div>
  );
}
