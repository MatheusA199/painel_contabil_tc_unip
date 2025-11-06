
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(date-picker|radio|table|button|ripple|spinner|calendar|date-input|popover|checkbox|spacer).js",
    "./node_modules/@heroui/theme/dist/components/(table|checkbox|form|spacer).js"
  ],
  theme: {
    fontFamily: {
      quicksand: "Quicksand, sans-serif",
      lato: "Lato, sans-serif",
      inter: "Inter, sans-serif",
      poppins: "Poppins, sans-serif",
      karla: "Karla, sans-serif",

    },
    extend: {
      colors: {
        ativa: {
          gray: 'rgba(var(--gray), <alpha-value>)',
          "light-gray": 'rgba(var(--light-gray), <alpha-value>)',
          yallow: 'rgba(var(--yallow), <alpha-value>)',
          red: 'rgba(var(--red), <alpha-value>)',
          pink: 'rgba(var(--pink), <alpha-value>)',
          orange: 'rgba(var(--orange), <alpha-value>)',
          green: 'rgba(var(--green), <alpha-value>)',
          blue: 'rgba(var(--blue), <alpha-value>)',
          purple: 'rgba(var(--purple), <alpha-value>)',
          "sea-blue": 'rgba(var(--sea-blue), <alpha-value>)',
          hover: 'rgba(var(--hover), <alpha-value>)',
          click: 'rgba(var(--click), <alpha-value>)',
          icon: 'rgba(var(--icon), <alpha-value>)',
          outline: 'rgba(var(--outline), <alpha-value>)',
          divider: 'rgba(var(--divider), <alpha-value>)',
          disabled: 'rgba(var(--text-disabled), <alpha-value>)',
        }
      },
      backgroundColor: {
        ativa: {
          gray: 'rgba(var(--gray), <alpha-value>)',
          "light-gray": 'rgba(var(--light-gray), <alpha-value>)',
          "dark-gray": 'rgba(var(--dark-gray), <alpha-value>)',
          "dark-gray-soft": 'rgba(var(--dark-gray-soft), <alpha-value>)',
          "titanio-900": 'rgba(var(--titanio-900), <alpha-value>)',
          yallow: 'rgba(var(--yallow), <alpha-value>)',
          red: 'rgba(var(--red), <alpha-value>)',
          pink: 'rgba(var(--pink), <alpha-value>)',
          orange: 'rgba(var(--orange), <alpha-value>)',
          green: 'rgba(var(--green), <alpha-value>)',
          blue: 'rgba(var(--blue), <alpha-value>)',
          purple: 'rgba(var(--purple), <alpha-value>)',
          "sea-blue": 'rgba(var(--sea-blue), <alpha-value>)',
          hover: 'rgba(var(--hover), <alpha-value>)',
          click: 'rgba(var(--click), <alpha-value>)',
          icon: 'rgba(var(--icon), <alpha-value>)',
          outline: 'rgba(var(--outline), <alpha-value>)',
          divider: 'rgba(var(--divider), <alpha-value>)',
          disabled: 'rgba(var(--text-disabled), <alpha-value>)',

        }
      },
      textColor: {
        gray: {
          primary: 'rgba(var(--text-primary), <alpha-value>)',
          secondary: 'rgba(var(--text-secondary), <alpha-value>)',
          tertiary: 'rgba(var(--text-tertiary), <alpha-value>)',
        },
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        focus: 'var(--shadow-focus)',
        outline: 'var(--shadow-outline)',
        'button-focus': 'var(--shadow-button-focus)',
      },
      blur: {
        default: 'var(--blur)',
      },
      borderRadius: {
        none: 'var(--border-radius-none)',
        sm: 'var(--border-radius-sm)',
        md: 'var(--border-radius-md)',
        lg: 'var(--border-radius-lg)',
      }
    },
  },
  plugins: [
    nextui(),
    heroui({
        mytheme: {
          colors: {
            primary: {
              DEFAULT: "#BEF264",
              foreground: "#000000",
            },
            focus: "#BEF264",
          }
        }
      })],
};
