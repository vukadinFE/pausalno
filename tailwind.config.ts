import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default <Partial<Config>>{
  theme: {
    extend: {
      gridTemplateColumns: {
        "auto-fill-100": "repeat(auto-fill, minmax(100px, 1fr))",
      },
      color: {
        flicak: {
          DEFAULT: "#ff0084",
        },
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "auto-fill": (value) => ({
            gridTemplateColumns: `repeat(auto-fill, minmax(min(${value}, 100%), 1fr))`,
          }),
          "auto-fit": (value) => ({
            gridTemplateColumns: `repeat(auto-fit, minmax(min(${value}, 100%), 1fr))`,
          }),
        },
        {
          values: theme("width", {}),
        }
      );
    }),
  ],
};
