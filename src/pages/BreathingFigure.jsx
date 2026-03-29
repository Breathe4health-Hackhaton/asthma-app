import { useEffect, useRef } from 'react';

const CHEST_IDLE = { rx: 34, ry: 36 };
const CHEST_FULL = { rx: 46, ry: 50 };
const BELLY_IDLE = { rx: 28, ry: 26 };
const BELLY_SMALL = { rx: 22, ry: 18 };

const PHASES = {
    'Nefes Al': { color: '#1D4ED8', hint: 'Göğsünü genişlet — göğüs şişer, karın içe çekilir' },
    'İçinde Tut': { color: '#92400E', hint: 'Nefesi tut — hem göğüs hem karın sabit' },
    'Yavaşça Ver': { color: '#166534', hint: 'Göğüs yavaşça iner — ağızdan üfler gibi ver' },
};

function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function BreathingFigure({ phase, count }) {
    const chestRef = useRef(null);
    const bellyRef = useRef(null);
    const chestGlowRef = useRef(null);
    const rafRef = useRef(null);

    const state = useRef({
        chestRx: CHEST_IDLE.rx, chestRy: CHEST_IDLE.ry,
        bellyRx: BELLY_IDLE.rx, bellyRy: BELLY_IDLE.ry,
        glowOp: 0,
    });

    function applyState() {
        const s = state.current;
        chestRef.current?.setAttribute('rx', s.chestRx.toFixed(1));
        chestRef.current?.setAttribute('ry', s.chestRy.toFixed(1));
        bellyRef.current?.setAttribute('rx', s.bellyRx.toFixed(1));
        bellyRef.current?.setAttribute('ry', s.bellyRy.toFixed(1));
        if (chestGlowRef.current) {
            chestGlowRef.current.setAttribute('rx', (s.chestRx + 6).toFixed(1));
            chestGlowRef.current.setAttribute('ry', (s.chestRy + 6).toFixed(1));
            chestGlowRef.current.setAttribute('opacity', s.glowOp.toFixed(3));
        }
    }

    function lerp(a, b, t) { return a + (b - a) * t; }

    function startAnim(to, dur) {
        cancelAnimationFrame(rafRef.current);
        const from = { ...state.current };
        let startTs = null;

        function step(ts) {
            if (!startTs) startTs = ts;
            const raw = Math.min((ts - startTs) / dur, 1);
            const t = easeInOut(raw);
            state.current = {
                chestRx: lerp(from.chestRx, to.chestRx, t),
                chestRy: lerp(from.chestRy, to.chestRy, t),
                bellyRx: lerp(from.bellyRx, to.bellyRx, t),
                bellyRy: lerp(from.bellyRy, to.bellyRy, t),
                glowOp: lerp(from.glowOp, to.glowOp, t),
            };
            applyState();
            if (raw < 1) rafRef.current = requestAnimationFrame(step);
        }

        rafRef.current = requestAnimationFrame(step);
    }

    function startPulse() {
        cancelAnimationFrame(rafRef.current);
        let val = 0.3, dir = 1;

        function step() {
            val += 0.015 * dir;
            if (val >= 0.5) dir = -1;
            if (val <= 0.2) dir = 1;
            chestGlowRef.current?.setAttribute('opacity', val.toFixed(3));
            rafRef.current = requestAnimationFrame(step);
        }

        rafRef.current = requestAnimationFrame(step);
    }

    useEffect(() => {
        cancelAnimationFrame(rafRef.current);

        if (phase === 'Nefes Al') {
            startAnim({
                chestRx: CHEST_FULL.rx, chestRy: CHEST_FULL.ry,
                bellyRx: BELLY_SMALL.rx, bellyRy: BELLY_SMALL.ry,
                glowOp: 0.45,
            }, 4000);

        } else if (phase === 'İçinde Tut') {
            state.current = {
                chestRx: CHEST_FULL.rx, chestRy: CHEST_FULL.ry,
                bellyRx: BELLY_SMALL.rx, bellyRy: BELLY_SMALL.ry,
                glowOp: 0.3,
            };
            applyState();
            startPulse();

        } else if (phase === 'Yavaşça Ver') {
            startAnim({
                chestRx: CHEST_IDLE.rx, chestRy: CHEST_IDLE.ry,
                bellyRx: BELLY_IDLE.rx, bellyRy: BELLY_IDLE.ry,
                glowOp: 0,
            }, 8000);

        } else {
            state.current = {
                chestRx: CHEST_IDLE.rx, chestRy: CHEST_IDLE.ry,
                bellyRx: BELLY_IDLE.rx, bellyRy: BELLY_IDLE.ry,
                glowOp: 0,
            };
            applyState();
        }

        return () => cancelAnimationFrame(rafRef.current);
    }, [phase]);

    const phaseData = PHASES[phase] || {};

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>

            <svg width="100%" viewBox="0 0 260 340" style={{ maxWidth: '240px' }}>

                {/* Kafa */}
                <circle cx="130" cy="50" r="34" fill="#F5C8A0" stroke="#D4956A" strokeWidth="1.5" />
                <path d="M100 42 Q106 16 130 12 Q154 16 160 42 Q148 26 130 24 Q112 26 100 42Z" fill="#3D2B1F" />
                <circle cx="119" cy="50" r="3.5" fill="#3D2B1F" />
                <circle cx="141" cy="50" r="3.5" fill="#3D2B1F" />
                <path d="M120 63 Q130 71 140 63" fill="none" stroke="#C07050" strokeWidth="1.5" strokeLinecap="round" />

                {/* Boyun */}
                <rect x="122" y="80" width="16" height="18" rx="5" fill="#F5C8A0" stroke="#D4956A" strokeWidth="1" />

                {/* Sol kol */}
                <rect x="80" y="97" width="22" height="56" rx="11" fill="#4A90D9" stroke="#2E6FAD" strokeWidth="1.5" />
                <ellipse cx="91" cy="159" rx="13" ry="9" fill="#F5C8A0" stroke="#D4956A" strokeWidth="1" />

                {/* Sağ kol */}
                <rect x="158" y="97" width="22" height="56" rx="11" fill="#4A90D9" stroke="#2E6FAD" strokeWidth="1.5" />
                <ellipse cx="169" cy="159" rx="13" ry="9" fill="#F5C8A0" stroke="#D4956A" strokeWidth="1" />

                {/* Göğüs glow */}
                <ellipse ref={chestGlowRef} cx="130" cy="122" rx="40" ry="42" fill="#93C5FD" opacity="0" />

                {/* Göğüs */}
                <ellipse ref={chestRef} cx="130" cy="122" rx="34" ry="36" fill="#4A90D9" stroke="#2E6FAD" strokeWidth="2" />

                {/* Karın */}
                <ellipse ref={bellyRef} cx="130" cy="196" rx="28" ry="26" fill="#3A78C2" stroke="#1E5FA5" strokeWidth="2" />

                {/* Bacaklar */}
                <rect x="106" y="222" width="24" height="72" rx="11" fill="#2D5A8E" stroke="#1E3F66" strokeWidth="1.5" />
                <rect x="130" y="222" width="24" height="72" rx="11" fill="#2D5A8E" stroke="#1E3F66" strokeWidth="1.5" />
                <ellipse cx="118" cy="298" rx="16" ry="9" fill="#3D2B1F" stroke="#2A1D12" strokeWidth="1" />
                <ellipse cx="142" cy="298" rx="16" ry="9" fill="#3D2B1F" stroke="#2A1D12" strokeWidth="1" />

                {/* Etiketler */}
                <rect x="178" y="110" width="62" height="22" rx="5" fill="#DBEAFE" />
                <text x="209" y="125" textAnchor="middle" fontSize="11" fill="#1E40AF" fontWeight="500">Göğüs ↕</text>
                <line x1="178" y1="121" x2="164" y2="121" stroke="#3B82F6" strokeWidth="0.8" strokeDasharray="3 3" />

                <rect x="178" y="184" width="62" height="22" rx="5" fill="#DBEAFE" />
                <text x="209" y="199" textAnchor="middle" fontSize="11" fill="#1E40AF" fontWeight="500">Karın ↕</text>
                <line x1="178" y1="195" x2="158" y2="195" stroke="#2563EB" strokeWidth="0.8" strokeDasharray="3 3" />

            </svg>

            {phaseData.hint && (
                <p style={{
                    fontSize: '12px', color: '#888', textAlign: 'center',
                    margin: '2px 0 0', padding: '0 16px', lineHeight: 1.5,
                    minHeight: '36px', maxWidth: '260px',
                }}>
                    {phaseData.hint}
                </p>
            )}

        </div>
    );
}
