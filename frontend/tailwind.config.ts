import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default <Config>{
  theme: {
    extend: {
      colors: {
        // ваши цвета здесь
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
