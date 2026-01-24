
import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle, Loader } from 'lucide-react';
import { Button } from './Button';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    onPaymentSuccess: (paymentDetails?: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
    isOpen,
    onClose,
    totalAmount,
    onPaymentSuccess
}) => {
    const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setStep('form');
            setCardNumber('');
            setExpiry('');
            setCvc('');
            setName('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep('processing');

        // Generate a unique transaction ID
        const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Simulate payment processing
        setTimeout(() => {
            setStep('success');
            playSuccessSound();

            // Close after showing success for a moment
            setTimeout(() => {
                // Pass only transaction ID to parent
                onPaymentSuccess({
                    transactionId: transactionId
                });
                onClose();
            }, 2000);
        }, 2000);
    };

    const playSuccessSound = () => {
        // Base64 encoded simple success chime (no external dependency)
        const successSound = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"; // Truncated for brevity, I will use a real short base64 string in the real tool call.

        // Actually, generating a real pleasant sound via AudioContext is even more reliable than a huge base64 string.
        // Let's use the Web Audio API for a guaranteed synth sound.
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.6);
        } catch (e) {
            console.error("Audio playback error", e);
        }
    };

    // Format card number with spaces
    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            setCardNumber(parts.join(' '));
        } else {
            setCardNumber(v);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        Secure Checkout
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    {step === 'form' && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="mb-6 text-center">
                                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                <p className="text-3xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Card Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        maxLength={19}
                                        placeholder="0000 0000 0000 0000"
                                        value={cardNumber}
                                        onChange={handleCardChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-mono"
                                    />
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Expiry</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-center"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">CVC</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            required
                                            maxLength={3}
                                            placeholder="123"
                                            value={cvc}
                                            onChange={(e) => setCvc(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-center letter-spacing-2"
                                        />
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Cardholder Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="JOHN DOE"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                                />
                            </div>

                            <Button type="submit" className="w-full bg-black text-white py-3 rounded-lg mt-4 hover:bg-gray-800 transition-all font-medium text-lg">
                                Pay ${totalAmount.toFixed(2)}
                            </Button>

                            <div className="flex justify-center gap-2 mt-4 opacity-50">
                                {/* Simple visual placeholders for card brands */}
                                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                            </div>
                        </form>
                    )}

                    {step === 'processing' && (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                            <Loader className="h-12 w-12 text-black animate-spin" />
                            <div>
                                <h4 className="text-lg font-medium text-gray-900">Processing Payment</h4>
                                <p className="text-gray-500 text-sm">Please do not close this window...</p>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300">
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-gray-900">Payment Successful!</h4>
                                <p className="text-gray-500 mt-2">Thank you for your purchase.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
