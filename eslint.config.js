import js from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: typescriptParser,
            globals: globals.jest,
        },
        rules: {
            "semi": "error",
            "comma-dangle": ["error", "always-multiline"],
            "indent": ["error", 2],
            "eol-last": "error",
            "object-curly-spacing": ["error", "always"],
        },
    },
];
