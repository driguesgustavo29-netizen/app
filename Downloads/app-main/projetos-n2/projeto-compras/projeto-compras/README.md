# Projeto 2 — App de Conferência de Compras por Imagem

App mobile em React Native (Expo) para montar uma lista de compras a partir de
fotos dos produtos, com cálculo automático do total.

## Tecnologias
- React Native (Expo)
- Firebase Authentication (login)
- Cloud Firestore (lista de compras, por usuário)
- Câmera via expo-image-picker
- expo-image-manipulator (tratamento da imagem)

## Como rodar
1. Instale as dependências:
   ```
   npm install
   ```
2. Inicie:
   ```
   npx expo start
   ```
3. Abra no celular pelo app **Expo Go** (QR Code). A câmera só funciona em
   celular físico.

## Importante: criar usuário
Este app só tem tela de login. Crie um usuário no console do Firebase:
Authentication > Users > Add user (e-mail e senha). Use esse e-mail/senha
para entrar.

## Rotinas (conforme enunciado)
1. **Login e autenticação** — login com Firebase Auth, validação de campos e
   erros; só usuários logados acessam a lista.
2. **Captura e tratamento da imagem** — foto pela câmera, redimensionamento
   (800px), compressão (0.7) e conversão JPEG antes de salvar.
3. **Cadastro de itens** — nome, imagem, valor unitário, quantidade e total do
   item; salvo no Firestore e associado ao usuário (cada um vê só a sua lista).
4. **Gerenciamento e cálculo** — listagem em tempo real, alterar quantidade,
   excluir itens, cálculo automático do total por item e do total geral.
