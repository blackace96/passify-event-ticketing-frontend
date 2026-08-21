import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Camera, Ticket } from 'lucide-react';
import { BrowserQRCodeReader } from '@zxing/library';
import api from '../services/api';
import toast from 'react-hot-toast';
 
export default function ValidatePage() {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const magicToken = searchParams.get('token');
 
  const [step, setStep] = useState('pin');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [validatorData, setValidatorData] = useState(null);
  const [result, setResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const inputRefs = useRef([]);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
 
  useEffect(() => {
    return () => stopCamera();
  }, []);
 
  const startCamera = async () => {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('Camera is not supported by this browser');
      return;
    }

    // Request camera explicitly
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    // Attach stream to video
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute('playsinline', 'true');
      videoRef.current.muted = true;

      await videoRef.current.play();
    }

    setCameraActive(true);

    // Start ZXing
    codeReaderRef.current = new BrowserQRCodeReader();

    codeReaderRef.current.decodeFromVideoElement(
      videoRef.current,
      async (result, err) => {
        if (result) {
          const token = result.getText();

          stopCamera();

          await handleScan(token);
        }
      }
    );

  } catch (err) {
    console.error('Camera error:', err);

    if (err.name === 'NotAllowedError') {
      toast.error(
        'Camera permission was denied. Please allow camera access in your browser settings.'
      );
    } else if (err.name === 'NotFoundError') {
      toast.error('No camera was found on this device.');
    } else if (err.name === 'NotReadableError') {
      toast.error('Camera is being used by another application.');
    } else if (err.name === 'SecurityError') {
      toast.error('Camera requires a secure HTTPS connection.');
    } else {
      toast.error(`Could not access camera: ${err.message}`);
    }

    setCameraActive(false);
  }
};

const stopCamera = () => {
  // Stop ZXing
  if (codeReaderRef.current) {
    codeReaderRef.current.reset();
    codeReaderRef.current = null;
  }

  // IMPORTANT: stop the actual camera tracks
  if (videoRef.current?.srcObject) {
    const tracks = videoRef.current.srcObject.getTracks();

    tracks.forEach((track) => track.stop());

    videoRef.current.srcObject = null;
  }

  setCameraActive(false);
};
 
  const handlePinChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
 
  const handlePinKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
 
  const handleVerifyPin = async () => {
    const pinString = pin.join('');
    if (pinString.length !== 6) {
      toast.error('Please enter the full 6-digit PIN');
      return;
    }
    try {
      setVerifying(true);
      const res = await api.post('/validators/verify', {
        magicToken,
        pin: pinString,
      });
      setValidatorData(res.data);
      setStep('scan');
      toast.success('Access granted!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid PIN. Try again.');
      setPin(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };
 
  const handleScan = async (qrToken) => {
    try {
      setScanning(true);
      const res = await api.post('/scans', {
        qrToken,
        validatorId: validatorData.validator.id,
      });
      setResult({ valid: true, message: res.data.message, ticket: res.data.ticket });
      setStep('result');
    } catch (err) {
      setResult({ valid: false, message: err.response?.data?.message || 'Invalid ticket' });
      setStep('result');
    } finally {
      setScanning(false);
    }
  };
 
  const handleManualEntry = async (e) => {
    e.preventDefault();
    const token = e.target.token.value.trim();
    if (!token) return;
    await handleScan(token);
  };
 
  return (
    <div className="min-h-screen bg-[#090912] text-white flex flex-col items-center justify-center px-4 py-12">
 
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <svg width="52" height="26" viewBox="0 0 92 48" fill="none">
          <rect x="0" y="2" width="92" height="44" rx="9" fill="#6c47ff"/>
          <circle cx="0" cy="24" r="9" fill="#0d0d1a"/>
          <circle cx="92" cy="24" r="9" fill="#0d0d1a"/>
          <line x1="22" y1="4" x2="22" y2="44" stroke="#0d0d1a" strokeWidth="1.5" strokeDasharray="3 3"/>
          <text x="38" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="white" fontFamily="system-ui">P</text>
        </svg>
        <span className="text-white font-bold tracking-widest text-base">PASSIFY</span>
      </div>
 
      <div className="w-full max-w-md">
 
        {/* PIN step */}
        {step === 'pin' && (
          <div className="bg-[#111122] border border-white/10 rounded-2xl p-8 text-center space-y-6">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#6c47ff]/20 border border-[#6c47ff]/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h1 className="text-white text-xl font-bold mb-2">Enter validator PIN</h1>
              <p className="text-white text-base">Enter the 6-digit PIN shared by the event organiser</p>
            </div>
 
            <div className="flex items-center justify-center gap-3">
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(i, e)}
                  className="w-12 h-14 bg-white/5 border border-white/10 focus:border-[#6c47ff] rounded-full text-center text-white text-xl font-bold outline-none transition-colors"
                />
              ))}
            </div>
 
            <button
              onClick={handleVerifyPin}
              disabled={verifying || pin.join('').length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-[#6c47ff] hover:bg-[#7c57ff] disabled:opacity-40 text-white font-medium py-4 rounded-full transition-all"
            >
              {verifying ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Verify PIN'}
            </button>
          </div>
        )}
 
        {/* Scan step */}
        {step === 'scan' && (
          <div className="space-y-4">
            <div className="bg-[#111122] border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-white text-base mb-1">Scanning for</p>
              <p className="text-white font-semibold">{validatorData?.event?.title}</p>
              <p className="text-white text-base">{validatorData?.validator?.name}</p>
            </div>
 
            <div className="bg-[#111122] border border-white/10 rounded-2xl p-6 text-center space-y-5">
 
              {/* Video feed */}
              <div className="relative w-full aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden bg-black border border-white/10">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  autoPlay
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-[#6c47ff] rounded-2xl relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#6c47ff] rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#6c47ff] rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#6c47ff] rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#6c47ff] rounded-br-lg" />
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#6c47ff] opacity-60 animate-pulse" />
                  </div>
                </div>
              </div>
 
              <p className="text-white text-base">Point camera at the QR code</p>
 
              <button
                onClick={cameraActive ? stopCamera : startCamera}
                className={`flex items-center justify-center gap-2 mx-auto px-6 py-3 rounded-full text-base font-medium transition-all ${
                  cameraActive
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                    : 'bg-[#6c47ff] hover:bg-[#7c57ff] text-white'
                }`}
              >
                <Camera size={16} />
                {cameraActive ? 'Stop camera' : 'Start camera'}
              </button>
 
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-zinc-600 text-base">or enter manually</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
 
              <form onSubmit={handleManualEntry} className="space-y-3">
                <input
                  name="token"
                  type="text"
                  placeholder="Paste QR token here..."
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white text-base placeholder-white outline-none focus:border-[#6c47ff]/50 transition-colors font-mono"
                />
                <button
                  type="submit"
                  disabled={scanning}
                  className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-[#6c47ff]/40 text-white font-medium py-3 rounded-full transition-all"
                >
                  {scanning ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Ticket size={16} /> Validate manually</>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
 
        {/* Result step */}
        {step === 'result' && result && (
          <div className={`bg-[#111122] border rounded-2xl p-8 text-center space-y-5 ${
            result.valid ? 'border-green-500/30' : 'border-red-500/30'
          }`}>
            {result.valid ? (
              <CheckCircle size={64} className="text-green-400 mx-auto" />
            ) : (
              <XCircle size={64} className="text-red-400 mx-auto" />
            )}
 
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${result.valid ? 'text-green-400' : 'text-red-400'}`}>
                {result.valid ? 'Valid Ticket ✓' : 'Invalid Ticket ✗'}
              </h2>
              <p className="text-zinc-400 text-base">{result.message}</p>
            </div>
 
            {result.valid && result.ticket && (
              <div className="bg-white/5 border border-white/10 rounded-full p-4 text-left space-y-2">
                <div className="flex justify-between text-base">
                  <span className="text-white">Name</span>
                  <span className="text-white">{result.ticket.guestName || result.ticket.user?.name}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-white">Event</span>
                  <span className="text-white">{result.ticket.event?.title}</span>
                </div>
              </div>
            )}
 
            <button
              onClick={() => { setStep('scan'); setResult(null); }}
              className="w-full flex items-center justify-center gap-2 bg-[#6c47ff] hover:bg-[#7c57ff] text-white font-medium py-4 rounded-full transition-all"
            >
              <Camera size={16} /> Scan next ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
 