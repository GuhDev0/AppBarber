import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Permitir uso de 'any' temporariamente
      "@typescript-eslint/no-explicit-any": "off",
      // Não obrigar const quando não há reatribuição
      "prefer-const": "off",
      // Ignorar variáveis não usadas (útil em dev)
      "@typescript-eslint/no-unused-vars": "off",
      // Ignorar dependências faltando em useEffect
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
