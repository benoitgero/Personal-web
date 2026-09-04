/* ═══════════════════════════════════════════════════════════
   ESLINT — flat config (ESLint 9+)
   Sin frameworks: solo JS de navegador con módulos ES.
   ═══════════════════════════════════════════════════════════ */
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", ".yarn/**", "vendor/**", "script.js"]
  },

  /* Código del sitio: js/ y contenido/ son módulos ES */
  {
    files: ["js/**/*.js", "contenido/**/*.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.browser }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", caughtErrors: "none" }
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["warn", "smart"],
      "prefer-const": "warn",
      "no-var": "warn"
    }
  }
];
