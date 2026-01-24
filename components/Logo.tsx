import React from 'react';

export const Logo = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
    >
        {/* The Concept: "The Author's Hanger" 
        It combines a clothing hanger (Wear) with a fountain pen nib (Story).
    */}

        {/* The Hook (Top of hanger) */}
        <path d="M9 6c0-2.2 1.8-4 4-4s4 1.8 4 4c0 2-2 3-3 3" />

        {/* The Shoulder / Pen Nib Body */}
        {/* Connecting hook to shoulders, then forming the V shape of a nib */}
        <path d="M14 9l7 3-9 10-9-10 7-3" />

        {/* The Nib Slit / Ink Channel (Detail that makes it look like a pen) */}
        <line x1="12" y1="15" x2="12" y2="22" />

        {/* The Breather Hole (Classic nib feature) */}
        <circle cx="12" cy="14" r="1" fill="currentColor" className="text-current" />
    </svg>
);
