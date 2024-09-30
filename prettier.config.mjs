/** @type {import('prettier').Config} */
const config = {
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  trailingComma: "all",
  bracketSpacing: true,
  endOfLine: "lf",
  tailwindConfig: "./tailwind.config.ts",
  tailwindFunctions: ["cn"],
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
