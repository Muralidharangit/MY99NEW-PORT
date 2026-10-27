/* Tailwind CDN configuration – MY99EXCH brand tokens (mirrors :root in css/style.css) */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        night: '#08031D',    // main background
        deep: '#05020F',     // darkest background – footer
        surface: '#17072F',  // secondary purple – cards & panels
        royal: '#240849',    // deep royal purple – section variations
        line: '#2E1257',     // subtle purple border
        purple: '#8B2BFF',   // neon purple – accents & lighting
        gold: '#FFD21C',     // gold – primary CTAs & highlights
        amber: '#FFB000',    // amber gold – gradients
        snow: '#F8F5FF',     // primary text
        muted: '#B8AECF',    // secondary text
        ink: '#08031D',      // text on gold
        whatsapp: '#25D366',
        logoTeal: '#0F6A6D', // logo border teal
        logoTealGlow: '#1AA49D', // logo border hover teal
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        panel: '28px',
      },
    },
  },
};
