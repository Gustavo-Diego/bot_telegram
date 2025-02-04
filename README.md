# Bot Telegram - bot_telegram

Este é um bot Telegram que permite aos usuários escolher opções de menu e receber arquivos de mídia (fotos e vídeos) de pastas específicas.

## Como Configurar

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/bot_telegram.git
   cd bot_telegram


   Instale as dependências:
   bash
   npm install
   ```

   Adicione seu token do BotFather no arquivo em const token = "SEU_TOKEN_AQUI";

2. Crie pastas para armazenar os arquivos de mídia:

   bash
   mkdir pasta1 pasta2 pasta3 pasta4 pasta5 pasta6

3. Funcionalidades:

   - O bot exibe um menu com 6 opções.
   - Cada opção corresponde a uma pasta contendo arquivos de mídia.
   - O bot envia todos os arquivos da pasta selecionada.
   - Se o usuário digitar algo fora do esperado, o bot orienta o uso do menu.

   Estrutura de Pastas:

   - pasta1/: Arquivos para Opção 1
   - pasta2/: Arquivos para Opção 2
   - pasta3/: Arquivos para Opção 3
   - pasta4/: Arquivos para Opção 4
   - pasta5/: Arquivos para Opção 5
   - pasta6/: Arquivos para Opção 6

4. ***

   ### 6. Executar o Bot

   No terminal, execute:

   ```bash
   node index.js
   ```
