import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// `eslint-config-next` (Next 15) still ships legacy eslintrc-style configs, so
// bridge them into flat config with FlatCompat.
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Apostrophes/quotes in JSX copy — noise, not a real defect.
      "react/no-unescaped-entities": "off",
      // The codebase leans on `any` in a lot of places; keep it visible as a
      // warning so `next build` isn't blocked while it's cleaned up gradually.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      ".open-next/**",
      "app/generated/**",
      "prisma/seed.ts",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
