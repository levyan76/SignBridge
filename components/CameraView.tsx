
import React, { useRef, useEffect, useState } from 'react';

interface CameraViewProps {
  onFrameCapture: (base64: string) => void;
  isProcessing: boolean;
  activeGloss?: string[];
  intent?: string;
  confidence?: number;
  isCameraOff?: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  onFrameCapture, 
  isProcessing, 
  activeGloss, 
  intent, 
  confidence, 
  isCameraOff 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<'initializing' | 'active' | 'denied' | 'not-found' | 'off'>('initializing');

  useEffect(() => {
    const startCamera = async () => {
      if (isCameraOff) {
        stopCamera();
        setCameraStatus('off');
        return;
      }

      setCameraStatus('initializing');
      setError(null);

      // Vérification du support API
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        handleCameraFailure({ name: 'NotSupportedError', message: "L'API Caméra n'est pas disponible (contexte non sécurisé ou navigateur obsolète)." });
        return;
      }

      const constraintList: MediaStreamConstraints[] = [
        { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } },
        { video: { facingMode: 'user' } },
        { video: true }
      ];

      let stream: MediaStream | null = null;
      let lastError: any = null;

      // Tentative directe d'acquisition pour déclencher le prompt de permission
      // (Certains navigateurs ne listent pas les périphériques tant qu'une permission n'est pas accordée)
      for (const constraints of constraintList) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (stream) break; 
        } catch (err: any) {
          lastError = err;
          // Si l'utilisateur a refusé explicitement, on arrête de boucler
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            break;
          }
        }
      }

      if (stream) {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.error("Play error:", e));
            setCameraStatus('active');
            setIsDemoMode(false);
          };
        }
      } else {
        // Si aucune capture possible, on vérifie si c'est vraiment "Not Found" via enumerateDevices
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasVideo = devices.some(device => device.kind === 'videoinput');
          if (!hasVideo) {
            handleCameraFailure({ name: 'NotFoundError', message: 'Aucun matériel caméra détecté.' });
          } else {
            handleCameraFailure(lastError || { name: 'UnknownError', message: 'Impossible d\'activer le flux.' });
          }
        } catch (e) {
          handleCameraFailure(lastError || e);
        }
      }
    };
    
    startCamera();

    return () => stopCamera();
  }, [isCameraOff]);

  const handleCameraFailure = (err: any) => {
    const errName = err?.name || "UnknownError";
    const errMsg = err?.message || (typeof err === 'string' ? err : "Erreur inconnue");
    
    console.warn(`Initialisation caméra (${errName}):`, errMsg);
    
    let userMsg = "Erreur de connexion caméra.";
    if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError' || errMsg.toLowerCase().includes('not found')) {
      setCameraStatus('not-found');
      userMsg = "Aucun capteur vidéo physique détecté sur cet appareil.";
    } else if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
      setCameraStatus('denied');
      userMsg = "Accès à la caméra refusé par l'utilisateur ou le navigateur.";
    } else {
      setCameraStatus('not-found');
      userMsg = `Échec d'activation : ${errName}.`;
    }

    setError(userMsg);
    setIsDemoMode(true); // Basculement automatique en mode démo/simulation
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const simulateCapture = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(320, 240, 50, 320, 240, 400);
        gradient.addColorStop(0, '#1e3a8a');
        gradient.addColorStop(1, '#020617');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 640, 480);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("SIMULATION IA", 320, 220);
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "#93c5fd";
        ctx.fillText("Matériel non détecté - Mode démo activé", 320, 250);
        
        // Scan line effect in canvas
        ctx.strokeStyle = "rgba(147, 197, 253, 0.2)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, (Date.now() % 4800) / 10);
        ctx.lineTo(640, (Date.now() % 4800) / 10);
        ctx.stroke();

        const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
        onFrameCapture(base64);
      }
    }
  };

  const captureFrame = () => {
    if (isDemoMode) {
      simulateCapture();
      return;
    }
    
    if (videoRef.current && canvasRef.current && cameraStatus === 'active') {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
        onFrameCapture(base64);
      }
    }
  };

  return (
    <div className="relative w-full aspect-video bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transition-all duration-500 group">
      {cameraStatus === 'active' && !isCameraOff && (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform scale-x-[-1]" 
          />
          <canvas 
            ref={overlayRef} 
            width="640" 
            height="480" 
            className="absolute inset-0 w-full h-full pointer-events-none transform scale-x-[-1]" 
          />
        </>
      )}

      {cameraStatus === 'initializing' && !isCameraOff && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-blue-400 animate-pulse">Scan des périphériques...</p>
        </div>
      )}

      {(isDemoMode && cameraStatus !== 'initializing' && cameraStatus !== 'off') && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-slate-900/60 backdrop-blur-md text-center animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mb-6 text-blue-400 border-2 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <i className={`fas ${cameraStatus === 'denied' ? 'fa-lock' : 'fa-video-slash'} text-3xl`}></i>
          </div>
          <h4 className="text-white font-black text-sm uppercase tracking-[0.3em] mb-3">
            {cameraStatus === 'denied' ? 'Accès Restreint' : 'Mode Émulation'}
          </h4>
          <p className="text-[11px] font-medium text-slate-300 max-w-xs mb-8 leading-relaxed opacity-80">
            {error || "L'IA SignBridge utilisera des données simulées pour cette session car aucun matériel compatible n'a été trouvé."}
          </p>
          <div className="flex gap-4">
             <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
              >
                Réessayer
              </button>
          </div>
        </div>
      )}

      {cameraStatus === 'off' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950">
          <div className="w-16 h-16 rounded-full border-2 border-slate-800 flex items-center justify-center text-slate-700 mb-4">
            <i className="fas fa-eye-slash text-2xl"></i>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Confidentialité : Caméra Off</p>
        </div>
      )}

      <canvas ref={canvasRef} width="640" height="480" className="hidden" />
      
      {isProcessing && cameraStatus !== 'off' && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="w-full h-1 bg-blue-400 shadow-[0_0_20px_#60a5fa] animate-[scan_2s_linear_infinite] opacity-80"></div>
          <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
        </div>
      )}

      {cameraStatus !== 'off' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-8 flex justify-center z-30">
          <button
            onClick={captureFrame}
            disabled={isProcessing}
            className={`group px-10 py-5 rounded-[2.5rem] font-black text-white shadow-2xl transition-all active:scale-95 flex items-center gap-4 border-2 border-white/20 ${
              isProcessing ? 'bg-slate-800' : 'bg-blue-600 hover:bg-blue-700 ring-4 ring-blue-500/20'
            }`}
          >
            {isProcessing ? (
               <i className="fas fa-circle-notch fa-spin text-lg"></i>
            ) : (
               <i className="fas fa-sign-language text-lg group-hover:rotate-12 transition-transform"></i>
            )}
            <span className="uppercase tracking-[0.2em] text-[11px]">
              {isProcessing ? 'Interprétation...' : (isDemoMode ? 'Lancer Simulation' : 'Capturer mon Signe')}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraView;
