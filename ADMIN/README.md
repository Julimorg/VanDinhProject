# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

# hello huy, hello thanh

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configurationa

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## download package

```js
npm install react@18 react-dom@18
npm install antd
npm install --save-dev @types/react-router-dom
npm install --save-dev @types/react-i18next
npm install flag-icon-css
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

npm install react-toastify
npm install axios
npm i zustand
npm i @tanstack/react-query
npm install tailwindcss @tailwindcss/vite
npm install --save-dev @types/styled-components

npm install electron electron-builder --save-dev
npm install concurrently wait-on --save-dev

# Xóa thư mục node_modules và file package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Cài đặt lại bằng yarn
yarn install

# Yarn Install Package
```js
yarn add -D electron-builder
yarn add --dev electron-is-dev
yarn add -D @types/electron
yarn add electron-reload --dev



```

Hiện tại sẽ dùng serve (Node static server) cho docker
