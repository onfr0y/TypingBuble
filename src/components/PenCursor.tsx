import React from 'react';

interface PenCursorProps {
    x: number;
    y: number;
}

const PenCursor: React.FC<PenCursorProps> = ({ x, y }) => {
    return (
        <div
            style={{
                position: 'fixed',
                left: x,
                top: y,
                pointerEvents: 'none',
                zIndex: 100,
                transition: 'left 0.1s ease-out, top 0.1s ease-out',
                transform: 'translate(-50%, -100%) rotate(-45deg)', // Adjust so tip is at (x,y)
                marginLeft: '15px', // Fine tuning offset to match tip to cursor
                marginTop: '-15px'
            }}
        >
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Nib body */}
                <path d="M50 100 L20 40 L30 10 L70 10 L80 40 Z" fill="url(#nibGradient)" stroke="#333" strokeWidth="2" />
                {/* Slit */}
                <line x1="50" y1="100" x2="50" y2="40" stroke="#222" strokeWidth="1" />
                {/* Breathing hole */}
                <circle cx="50" cy="40" r="3" fill="#222" />
                {/* Gold decoration */}
                <path d="M30 30 Q50 50 70 30" stroke="#D4AF37" strokeWidth="2" fill="none" />

                <defs>
                    <linearGradient id="nibGradient" x1="20" y1="40" x2="80" y2="40">
                        <stop offset="0%" stopColor="#C0C0C0" />
                        <stop offset="50%" stopColor="#E8E8E8" />
                        <stop offset="100%" stopColor="#C0C0C0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default PenCursor;
