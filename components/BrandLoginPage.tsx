import React, { useState, useEffect } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Logo } from './Logo';

interface BrandLoginPageProps {
    onBack: () => void;
}

export const BrandLoginPage: React.FC<BrandLoginPageProps> = ({ onBack }) => {
    const brandName = "Weare-Story";
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < brandName.length) {
            const timeout = setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, 80); // Faster, smoother timing
            return () => clearTimeout(timeout);
        }
    }, [currentIndex]);

    // Replace hyphen with curved tilde in Clerk title
    useEffect(() => {
        const interval = setInterval(() => {
            const titleElement = document.querySelector('.cl-headerTitle');
            if (titleElement && titleElement.textContent?.includes('-')) {
                const text = titleElement.textContent;
                const parts = text.split('-');
                // Replace hyphen with tilde and make the dot golden
                const secondPart = parts[1].replace('.', '<span style="color: #D4AF37;">.</span>');
                titleElement.innerHTML = parts[0] + '<span style="color: #D4AF37; font-size: 0.7em; transform: translateY(-0.15em) rotate(-10deg); display: inline-block; margin: 0 0.5rem; font-family: serif;">~</span>' + secondPart;
                clearInterval(interval);
            }
        }, 100);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-black cursor-default selection:bg-accent selection:text-black premium-font"
        >
            {/* Cinematic Editorial Background (Ken Burns Effect) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
                    alt="Premium Fashion Collection"
                    className="w-full h-full object-cover opacity-60 animate-ken-burns grayscale-[20%]"
                />

                {/* Sophisticated Overlays */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-95" />

                {/* Subtle Grain Overlay */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-7xl px-8 absolute inset-0">

                {/* Side A: Editorial Branding */}
                <div className="text-center lg:text-left text-white flex-1 max-w-lg">
                    <div className="flex justify-center lg:justify-start mb-14 animate-reveal-blur">
                        <div className="relative group">
                            <div className="relative bg-white/5 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                                <Logo className="h-16 w-16 text-white relative z-10" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter mb-8 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] leading-none font-serif text-white">
                        {brandName.split('').map((char, index) => (
                            <span
                                key={index}
                                className={`inline-block ${char === '-' ? 'text-accent mx-3' : ''}`}
                                style={{
                                    opacity: index < currentIndex ? 1 : 0,
                                    transition: 'opacity 0.2s ease',
                                    fontSize: char === '-' ? '0.7em' : undefined,
                                    transform: char === '-' && index < currentIndex ? 'translateY(-0.15em) rotate(-10deg)' : undefined,
                                    fontFamily: char === '-' ? 'serif' : undefined
                                }}
                            >
                                {char === '-' ? '~' : char}
                            </span>
                        ))}
                        <span 
                            className="inline-flex items-center justify-center bg-accent rounded-full"
                            style={{
                                opacity: currentIndex >= brandName.length ? 1 : 0,
                                transition: 'opacity 0.3s ease',
                                width: '0.15em',
                                height: '0.15em',
                                marginLeft: '0.1em',
                                marginRight: '0.1em'
                            }}
                        ></span>
                        <sup 
                            className="text-accent ml-1"
                            style={{
                                opacity: currentIndex >= brandName.length ? 1 : 0,
                                transition: 'opacity 0.3s ease',
                                fontSize: '0.4em'
                            }}
                        >™</sup>
                    </h1>

                    <div className="h-0.5 w-16 bg-accent lg:ml-0 mx-auto mb-10 opacity-60 animate-reveal-blur [animation-delay:400ms]" />

                    <p className="text-2xl text-gray-200 font-medium tracking-[0.1em] mb-12 animate-reveal-blur [animation-delay:600ms] premium-font">Every Chapter, Curated.</p>

                    <div className="hidden lg:block space-y-6 animate-reveal-blur [animation-delay:800ms]">
                        <p className="text-gray-400 font-light leading-relaxed max-w-md text-lg italic border-l border-white/10 pl-6 opacity-70">
                            "Style is a way to say who you are without having to speak."
                        </p>
                        <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase font-black pl-6">The Luxury Fashion House</p>
                    </div>
                </div>

                {/* Side B: ULTRA PREMIUM DARK GLASS DASHBOARD - FIXED PROPERLY */}
                <div className="w-full max-w-md flex items-center justify-center self-center">
                    <div 
                        className="relative group w-full"
                        style={{
                            opacity: currentIndex >= brandName.length ? 1 : 0,
                            transform: currentIndex >= brandName.length ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                            transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            transitionDelay: '0.3s'
                        }}
                    >
                        {/* Outer Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-transparent blur-3xl opacity-20 transition duration-1000 group-hover:opacity-40"></div>

                        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-black/30 backdrop-blur-[50px] w-full">
                            <style>{`
                                .cl-headerTitle {
                                    font-family: 'Playfair Display', serif !important;
                                }
                                .cl-headerTitle::first-line {
                                    letter-spacing: 0.02em;
                                }
                                /* Hide any white boxes or unwanted elements */
                                .cl-internal-b3fm6y,
                                .cl-formFieldInput__identifier,
                                .cl-formFieldInput__phoneNumber,
                                .cl-selectButton__countryCode {
                                    background: rgba(255, 255, 255, 0.05) !important;
                                    border-color: rgba(255, 255, 255, 0.1) !important;
                                }
                                /* Hide verification badges or white elements */
                                .cl-badge,
                                .cl-internal-badge,
                                [class*="badge"],
                                .cl-identityPreview,
                                .cl-identityPreviewText,
                                .cl-identityPreviewEditButton {
                                    display: none !important;
                                }
                                /* Hide "Last used" badge specifically */
                                .cl-internal-1xt88wy {
                                    display: none !important;
                                }
                                /* Hide white boxes near social buttons */
                                .cl-socialButtonsBlockButton::before,
                                .cl-socialButtonsBlockButton::after,
                                .cl-socialButtonsProviderIcon__apple::before,
                                .cl-socialButtonsProviderIcon__google::before {
                                    display: none !important;
                                }
                                /* Ensure all backgrounds are transparent or dark */
                                .cl-card,
                                .cl-main,
                                .cl-rootBox > div {
                                    background: transparent !important;
                                }
                                /* Make sure form fields are visible */
                                .cl-formFieldInput,
                                input[type="password"],
                                input[type="email"],
                                input[type="text"] {
                                    display: block !important;
                                    visibility: visible !important;
                                    opacity: 1 !important;
                                }
                                /* Remove any white overlays */
                                .cl-card > div,
                                .cl-main > div {
                                    background: transparent !important;
                                }
                                /* Force Continue button to have white background */
                                .cl-formButtonPrimary,
                                button[type="submit"] {
                                    background: white !important;
                                    color: black !important;
                                }
                            `}</style>
                            <SignIn
                                appearance={{
                                    layout: {
                                        helpPageUrl: "https://clerk.com",
                                        logoPlacement: "none",
                                        showOptionalFields: false,
                                        socialButtonsPlacement: "top",
                                        socialButtonsVariant: "blockButton",
                                    },
                                    variables: {
                                        colorText: '#ffffff',
                                    },
                                    elements: {
                                        rootBox: "w-full m-0",
                                        card: "w-full max-w-md p-5 sm:p-6 pr-2 sm:pr-2 bg-transparent shadow-none",
                                        
                                        // Header - Custom styling for brand name with curved hyphen
                                        header: "mb-3 text-center [&_.cl-headerTitle]:!text-white",
                                        headerTitle: "font-bold tracking-tight text-white text-2xl sm:text-3xl premium-font mb-0.5 text-center",
                                        headerSubtitle: "text-gray-400 text-sm premium-font text-center",

                                        // Social Buttons
                                        socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl h-11 transition-all duration-300 premium-font font-medium text-sm mb-1.5 w-full justify-center",
                                        socialButtonsBlockButtonText: "text-white font-medium",
                                        socialButtonsIconButton: "bg-white/5 border border-white/10 hover:bg-white/10",

                                        // Divider
                                        dividerRow: "my-2",
                                        dividerLine: "bg-white/10",
                                        dividerText: "text-gray-500 text-xs uppercase tracking-wider",

                                        // Form Fields
                                        form: "space-y-2",
                                        formFieldRow: "mb-2",
                                        formFieldLabel: "text-gray-400 text-xs uppercase tracking-widest font-bold mb-1 ml-1 block text-left",
                                        formFieldInput: "bg-white/5 border border-white/10 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 rounded-xl h-11 px-4 text-white transition-all premium-font placeholder:text-gray-600 text-sm w-full",
                                        formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",

                                        // Primary Button
                                        formButtonPrimary: "bg-white hover:bg-gray-200 text-black rounded-xl h-11 text-sm font-bold transition-all duration-300 shadow-2xl hover:shadow-accent/20 active:scale-[0.98] mt-0 premium-font w-full justify-center",

                                        // Footer
                                        footer: "mt-0 pt-1 border-t border-white/10 text-center",
                                        footerActionText: "text-gray-500 text-sm text-center",
                                        footerActionLink: "text-white font-bold hover:text-accent underline decoration-accent/40 underline-offset-4 transition-colors premium-font ml-1",
                                        footerAction: "text-center justify-center",

                                        // Additional Elements
                                        formResendCodeLink: "text-accent hover:text-accent/80 text-sm font-medium",
                                        otpCodeFieldInput: "bg-white/5 border border-white/10 text-white rounded-lg h-12 text-center text-lg font-bold",
                                        formFieldSuccessText: "text-green-400 text-xs mt-1",
                                        formFieldErrorText: "text-red-400 text-xs mt-1",
                                        formFieldHintText: "text-gray-500 text-xs mt-1",
                                        alertText: "text-gray-300 text-sm",
                                        identityPreviewText: "text-white",
                                        identityPreviewEditButton: "text-accent hover:text-accent/80",
                                        
                                        // Hide unwanted elements
                                        badge: "hidden",
                                        internal_debugLink: "hidden",
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
