# 💍 Casamento Aryana & Raul Filipe

Site oficial do casamento de Aryana & Raul Filipe.

## 📅 Evento

- Data: **11/10/2026**
- Horário: **09:00**

## ✨ Funcionalidades

- Página inicial personalizada
- Foto do casal
- Contagem regressiva até 11/10/2026 às 09:00
- Confirmação de presença
- Geração de código individual `CONV-XXXXXX`
- Registro das confirmações no Google Sheets
- Envio do nome e código pelo WhatsApp
- Check-in por código, com bloqueio de reutilização
- Contagem de adultos, crianças e total de presentes
- Lista de presentes por categorias
- Imagens dos presentes
- Controle de presentes escolhidos
- Opção de contribuição via PIX
- Integração da Lista de Presentes com Firebase Firestore

## 🧩 Arquitetura

O projeto utiliza dois serviços independentes:

### Google Apps Script + Google Sheets

Responsável por:

- confirmação de presença;
- geração dos códigos `CONV-XXXXXX`;
- armazenamento dos convidados;
- envio dos dados pelo WhatsApp;
- check-in e controle de códigos utilizados.

### Firebase Firestore

Responsável por:

- Lista de Presentes;
- registro dos presentes escolhidos;
- contribuições via PIX, conforme a lógica implementada no site.

A confirmação de presença **não utiliza mais o Firebase**.

## 📂 Estrutura

```text
Casamento-aryana-raul-filipe/
├── index.html
├── confirmacao.html
├── presentes.html
├── netlify.toml
├── README.md
├── .gitignore
│
├── css/
│   ├── style.css
│   ├── home.css
│   ├── confirmacao.css
│   └── presentes.css
│
├── js/
│   ├── app.js
│   ├── data.js
│   ├── firebase-config.js
│   ├── firebase-service.js
│   └── presentes.js
│
└── imagens/
    ├── casal.jpg
    └── presentes/
        └── imagens dos presentes
```

## 🎁 Lista de Presentes

Os dados dos presentes ficam em `js/data.js` e as imagens em `imagens/presentes/`.

## 🔥 Firebase

A configuração do Firebase fica em:

```text
js/firebase-config.js
```

As regras de segurança do Firestore devem ser configuradas no projeto Firebase. A configuração web do Firebase pode estar no código do site; a proteção deve ser feita pelas regras do Firestore.

## 🚀 Publicação

O projeto é um site estático e está preparado para:

- GitHub — versionamento do código;
- Netlify — hospedagem e deploy contínuo;
- Firebase — banco de dados da Lista de Presentes.

O `netlify.toml` define a raiz do projeto como diretório de publicação.

## 🛠 Atualização pelo GitHub

Depois de alterar arquivos:

```bash
git add .
git commit -m "Atualização do site"
git push
```

Com o Netlify conectado ao repositório, um novo push poderá gerar um novo deploy automaticamente.

## ❤️ Projeto

Desenvolvido para celebrar o casamento de:

**Aryana & Raul Filipe**
