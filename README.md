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
├── application/
│   ├── dtos/
│       ├── file-attachment-dto.ts
│       ├── monthly-summary-dto.ts
│       ├── transaction-dto.ts
│       ├── user-dto.ts
│       └── user-summary-dto.ts
│   ├── mappers/
│       ├── file-attachment-mapper.ts
│       ├── monthly-summary-mapper.ts
│       ├── transaction-mapper.ts
│       ├── user-mapper.ts
│       └── user-summary-mapper.ts
│   └── use-cases/
│       ├── auth/
│           ├── login-user-use-case.ts
│           ├── logout-user-user-case.ts
│           └── sign-up-user-use-case.ts
│       ├── document-picker/
│           ├── delete-file-attachment-use-case.ts
│           ├── list-transaction-files-use-case.ts
│           ├── pick-files-use-case.ts
│           └── upload-file-attachment-use-case.ts
│       ├── monthly-summary/
│           └── get-monthly-summaries-use-case.ts
│       ├── document-picker/
│           ├── add-transaction-use-case.ts
│           ├── delete-transaction-use-case.ts
│           ├── get-transactions-by-user-use-case.ts
│           └── update-transaction-use-case.ts
│       └── user-summary/
│           ├── create-user-summary-use-case.ts
│           ├── get-user-summary-use-case.ts
│           └── update-user-summary-use-case.ts
├── assets/
│   └── images/
├── domain/
│   ├── entities/
│       ├── file-attachment.ts
│       ├── monthly-summary.ts
│       ├── transaction.ts
│       ├── user-summary.ts
│       └── user.ts
│   ├── repositories/
│       ├── auth-repository.ts
│       ├── file-attachment-repository.ts
│       ├── monthly-summary-repository.ts
│       ├── transaction-repository.ts
│       └── user-summary-repository.ts
│   └── types/
├── infra/
│   ├── container/
│      ├── auth.container.ts
│      ├── file-attachment.ts
│      ├── index.ts
│      ├── monthly-summary.container.ts
│      ├── transaction.container.ts
│      └── user-summary.container.ts
│   ├── document-picker/
│      └── repositories/
│         └── expo-document-picker-repository.ts
│   └── firebase/
│       ├── config/
│           └── firebase-config.tsx
│       └── repositories/
│           ├── firebase-auth-repository.ts
│           ├── firebase-monthly-summary-repository.ts
│           ├── firebase-transaction-repository.ts
│           └── firebase-user-summary-repository.ts
├── types/
│   └── firebase-auth.d.ts
└── ui/
    ├── components/
        ├── base-button/
        ├── date-field/
        ├── header/
        ├── icons/
        ├── picker-field/
        ├── screens/
            ├── add-transaction.tsx
            ├── dashboard.tsx
            ├── extract.tsx
            └── login.tsx
        ├── text-field/
        └── toast/
    ├── constants/
        └── theme.ts
        └── transaction.ts
    ├── hooks/
        └── useAuthListener.ts
    └── stores/
        ├── auth-user-store.ts
        ├── monthly-summaries-store.ts
        ├── toastStore.ts
        └── transactions-store.ts
```