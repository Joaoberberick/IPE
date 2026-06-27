/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sepia: '#704214',
        khaki: '#c8a96e',
        'dark-red': '#8b0000',
        gold: '#d4af37',
        parchment: '#f4e4bc',
        'dark-brown': '#2d1b00',
        'mid-brown': '#5a3a1a',
        'light-khaki': '#e8d5a3',
        'pale-gold': '#f0d060',
        'deep-sepia': '#3d2008',
        'muted-green': '#4a5e3a',
        'battle-grey': '#6b6b5a',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Georgia', 'Times New Roman', 'serif'],
      },
      backgroundImage: {
        'parchment-texture': `
          radial-gradient(ellipse at 20% 50%, rgba(112,66,20,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(112,66,20,0.05) 0%, transparent 50%),
          linear-gradient(135deg, #f4e4bc 0%, #e8d5a3 40%, #f0d8a8 70%, #f4e4bc 100%)
        `,
        'dark-parchment': `
          radial-gradient(ellipse at 10% 20%, rgba(45,27,0,0.9) 0%, transparent 60%),
          radial-gradient(ellipse at 90% 80%, rgba(45,27,0,0.8) 0%, transparent 60%),
          linear-gradient(160deg, #2d1b00 0%, #3d2008 30%, #4a2810 60%, #2d1b00 100%)
        `,
        'map-bg': `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            rgba(200,169,110,0.08) 40px,
            rgba(200,169,110,0.08) 41px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(200,169,110,0.08) 40px,
            rgba(200,169,110,0.08) 41px
          ),
          linear-gradient(160deg, #2d1b00 0%, #3d2008 30%, #4a2810 60%, #2d1b00 100%)
        `,
      },
      keyframes: {
        fillBar: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--bar-width)' },
        },
        xpPop: {
          '0%': { opacity: '0', transform: 'translateY(0) scale(0.5)' },
          '50%': { opacity: '1', transform: 'translateY(-20px) scale(1.2)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scale(1)' },
        },
        unlockPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.7)' },
          '50%': { boxShadow: '0 0 20px 8px rgba(212,175,55,0.3)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        conquest: {
          '0%': { opacity: '0', transform: 'scale(0.5) rotate(-5deg)' },
          '60%': { opacity: '1', transform: 'scale(1.1) rotate(2deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        countUp: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fill-bar': 'fillBar 1.2s ease-out forwards',
        'xp-pop': 'xpPop 1.5s ease-out forwards',
        'unlock-pulse': 'unlockPulse 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'conquest': 'conquest 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'countUp 0.3s ease-out',
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(212,175,55,0.5), 0 0 30px rgba(212,175,55,0.2)',
        'dark-inset': 'inset 0 2px 8px rgba(0,0,0,0.5)',
        'parchment': '0 4px 20px rgba(45,27,0,0.3)',
        'military': '0 2px 0 rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
}
