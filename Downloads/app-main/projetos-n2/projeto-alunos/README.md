# Projeto 1 — Sistema de Cadastro de Alunos com Validação de Documentos

App mobile em React Native (Expo) para cadastro de alunos, upload de documentos
com tratamento de imagem e validação pelo atendente.

## Tecnologias
- React Native (Expo)
- Firebase Authentication (login/cadastro)
- Cloud Firestore (dados dos alunos e perfis)
- Armazenamento das imagens em diretório local (expo-file-system)
- expo-image-picker + expo-image-manipulator (captura e tratamento de imagem)

## Como rodar
1. Instale as dependências:
   ```
   npm install
   ```
2. Inicie o projeto:
   ```
   npx expo start
   ```
3. Abra no celular pelo app **Expo Go** (escaneie o QR Code).
   A câmera só funciona em celular físico.

## Perfis
- **Aluno:** cadastra-se, preenche o formulário e envia os documentos.
- **Atendente:** vê a lista de alunos, abre os documentos e muda o status
  de "Pendente" para "Entregue".

No cadastro (tela "Cadastrar-se") escolha o perfil. Para testar o atendente,
crie um usuário com perfil "Atendente".

## Rotinas (conforme enunciado)
1. **Login com Firebase Auth** — login + cadastro, validação de campos e erros.
2. **Cadastro de Aluno** — nome, CPF, RG, data, e-mail, telefone, curso (lista),
   com máscaras e validações; status inicial "Pendente"; salvo no Firestore.
3. **Upload e tratamento de imagens** — documento pessoal e certificado;
   redimensionamento (800px), compressão (0.7) e conversão JPEG antes de salvar;
   caminho salvo no Firestore.
4. **Validação pelo atendente** — listagem em tempo real, visualização dos
   documentos, troca de status e controle de perfil (aluno × atendente).

## Validações de campo
- **CPF:** máscara 000.000.000-00 + validação dos dígitos verificadores.
- **RG:** máscara 00.000.000-0.
- **Data:** máscara DD/MM/AAAA + validação de dia/mês/ano.
- **Telefone:** máscara (00) 00000-0000.
- **E-mail:** validação de formato.
- **Senha:** mínimo de 6 caracteres (cadastro).
