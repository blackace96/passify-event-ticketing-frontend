import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import FloatingTickets from '../components/ui/FloatingTickets';

export default function PaymentVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (reference) verifyPayment(reference);
    else setStatus('failed');
  }, []);

  const verifyPayment = async (reference) => {
    try {
      const res = await api.get(`/payments/verify/${reference}`);
      setTicket(res.data.ticket);
      setStatus('success');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white flex items-center justify-center px-4">
      <FloatingTickets />
      <div className="relative z-10 text-center max-w-md w-full">

        {status === 'verifying' && (
          <div className="bg-[#111122] border border-white/10 rounded-2xl p-10">
            <div className="w-16 h-16 border-4 border-[#6c47ff] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-white text-xl font-bold mb-2">Verifying payment...</h2>
            <p className="text-white text-sm">Please wait while we confirm your payment</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-[#111122] border border-green-500/20 rounded-2xl p-10 space-y-5">
            <CheckCircle size={64} className="text-green-400 mx-auto" />
            <div>
              <h2 className="text-white text-2xl font-bold mb-2">Payment successful! 🎉</h2>
              <p className="text-zinc-400 text-sm">Your ticket has been confirmed and sent to your email</p>
            </div>
            <div className="flex flex-col gap-3">
              {ticket && (
                <button
                  onClick={() => navigate(`/ticket/${ticket.qrToken}`)}
                  className="w-full bg-[#6c47ff] hover:bg-[#7c57ff] text-white font-medium py-3 rounded-full transition-all"
                >
                  View my ticket
                </button>
              )}
              <button
                onClick={() => navigate('/events')}
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white font-medium py-3 rounded-full transition-all"
              >
                Browse more events
              </button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-[#111122] border border-red-500/20 rounded-2xl p-10 space-y-5">
            <XCircle size={64} className="text-red-400 mx-auto" />
            <div>
              <h2 className="text-white text-2xl font-bold mb-2">Payment failed</h2>
              <p className="text-zinc-400 text-sm">Something went wrong with your payment. Please try again.</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-[#6c47ff] hover:bg-[#7c57ff] text-white font-medium py-3 rounded-full transition-all"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}