import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * AtmosphereLayer Component - Global cinematic overlay
 * Adds film grain, vignette, and light falloff for editorial feel
 * Applied globally in App.tsx
 * Respects prefers-reduced-motion (static noise only)
 */
const AtmosphereLayer: React.FC = () => {
    const prefersReduced = useReducedMotion();

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[100]"
            aria-hidden="true"
        >
            {/* Film Grain using SVG filter */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.025]" aria-hidden="true">
                <defs>
                    <filter id="akai-noise" x="0%" y="0%" width="100%" height="100%">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.8"
                            numOctaves="4"
                            stitchTiles="stitch"
                            result="noise"
                        />
                        <feColorMatrix
                            type="saturate"
                            values="0"
                            in="noise"
                            result="mono"
                        />
                    </filter>
                </defs>
                <rect width="100%" height="100%" filter="url(#akai-noise)" />
            </svg>

            {/* Vignette - radial gradient from transparent to dark edges */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
                }}
            />

            {/* Top light falloff - subtle gradient */}
            <div
                className="absolute top-0 left-0 right-0 h-48"
                style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 100%)',
                }}
            />

            {/* Bottom light falloff */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32"
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 100%)',
                }}
            />
        </div>
    );
};

export default AtmosphereLayer;
