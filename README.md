# Descrição
Este projeto utiliza **Expo** e integra com **Firebase** para gerenciamento de transações e uploads de arquivos.

## Pré-requisitos

- Node.js instalado (versão 22 ou superior recomendada)
- npm
- Expo CLI (`npm install -g expo-cli`)
- Conta Firebase configurada

## Como rodar o projeto

1. Instale as dependências do projeto:
```bash
npm install
```

2. Copie o arquivo de exemplo de variáveis de ambiente e configure suas chaves do Firebase:
```bash
cp .env.example .env.local
```

3. Para iniciar o projeto em modo de desenvolvimento:
```bash
npm start
```

## Estrutura de Pastas

```
/
├── .env.example
├── .env.local
├── .gitignore
├── app.json
├── eslint.config.js
├── expo-env.d.ts
├── firebaseConfig.ts
├── package.json
├── README.md
├── tsconfig.json
├── .expo/
│   ├── devices.json
│   ├── README.md
│   ├── types/
│   └── web/
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── app/
│   ├── _layout.tsx
│   ├── login.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── add-transaction.tsx
│       ├── dashboard.tsx
│       └── extract.tsx
├── assets/
│   └── images/
├── components/
│   ├── base-button/
│   ├── date-field/
│   ├── header/
│   ├── icons/
│   ├── picker-field/
│   ├── screens/
│       ├── add-transaction.tsx
│       ├── dashboard.tsx
│       ├── extract.tsx
│       └── login.tsx
│   ├── text-field/
│   └── toast/
├── constants/
│   └── theme.ts
├── hooks/
│   ├── useTransaction.ts
│   └── useUserSummary.ts
├── stores/
│   ├── toastStore.ts
│   └── userStore.ts
└── types/
    └── firebase-auth.d.ts
```