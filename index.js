const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");

// Substitua pelo seu token do BotFather
const token = "SEU_TOKEN_AQUI"; // Insira o token real aqui
const bot = new TelegramBot(token, { polling: true });

// Log de inicialização do bot
console.log("Bot iniciado com sucesso!");

// Função para enviar a mensagem inicial com botões inline
function sendWelcomeMessage(chatId) {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📷 🎥 Opção 1", callback_data: "opcao1" }],
        [{ text: "📷 🎥 Opção 2", callback_data: "opcao2" }],
        [{ text: "📷 🎥 Opção 3", callback_data: "opcao3" }],
        [{ text: "📷 🎥 Opção 4", callback_data: "opcao4" }],
        [{ text: "📷 🎥 Opção 5", callback_data: "opcao5" }],
        [{ text: "📷 🎥 Opção 6", callback_data: "opcao6" }],
      ],
    },
  };
  bot.sendMessage(
    chatId,
    "Bem-vindo ao bot! Escolha uma das opções abaixo:",
    options
  );
}

// Comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || "Usuário sem nome";
  console.log(`Usuário conectado: ${username} (chatId: ${chatId})`);
  sendWelcomeMessage(chatId);
});

// Tratando cliques nos botões inline
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  console.log(`Callback recebido: ${data} de chatId: ${chatId}`);

  const folderMap = {
    opcao1: "./pasta1",
    opcao2: "./pasta2",
    opcao3: "./pasta3",
    opcao4: "./pasta4",
    opcao5: "./pasta5",
    opcao6: "./pasta6",
  };

  const folderPath = folderMap[data];

  if (folderPath) {
    sendMediaFromFolder(chatId, folderPath);
  } else {
    bot.sendMessage(chatId, "Opção inválida.");
    sendWelcomeMessage(chatId);
  }
});

// Função para enviar mídia de uma pasta específica
function sendMediaFromFolder(chatId, folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(`Erro ao acessar a pasta ${folderPath}:`, err);
      bot.sendMessage(chatId, "Ocorreu um erro ao acessar a pasta.");
      return sendWelcomeMessage(chatId);
    }

    // Filtra apenas arquivos de foto e vídeo
    const mediaFiles = files.filter((file) =>
      [".jpg", ".jpeg", ".png", ".mp4"].some((ext) => file.endsWith(ext))
    );

    if (mediaFiles.length === 0) {
      bot.sendMessage(chatId, "A pasta está vazia.");
      return sendWelcomeMessage(chatId);
    }

    bot.sendMessage(chatId, `Enviando ${mediaFiles.length} arquivo(s)...`);

    let filesSent = 0; // Contador para rastrear o número de arquivos enviados

    function sendNextFile() {
      if (filesSent >= mediaFiles.length) {
        const message =
          mediaFiles.length === 1 && mediaFiles[0].endsWith(".mp4")
            ? "Vídeo enviado!"
            : `Todos os ${mediaFiles.length} arquivos foram enviados!`;
        bot.sendMessage(chatId, message);
        return sendWelcomeMessage(chatId);
      }

      const file = mediaFiles[filesSent];
      const filePath = path.join(folderPath, file);

      // Força o uso de application/octet-stream
      const options = {
        contentType: "application/octet-stream",
      };

      // Chama os métodos diretamente no objeto `bot`
      const sendPromise = file.endsWith(".mp4")
        ? bot.sendVideo(chatId, filePath, {}, options)
        : bot.sendPhoto(chatId, filePath, {}, options);

      sendPromise
        .then(() => {
          filesSent++;
          sendNextFile(); // Envia o próximo arquivo
        })
        .catch((error) => {
          console.error(`Erro ao enviar o arquivo ${file}:`, error);
          bot.sendMessage(chatId, `Erro ao enviar o arquivo ${file}.`);
          filesSent++;
          sendNextFile(); // Continua enviando os próximos arquivos
        });
    }

    sendNextFile();
  });
}

// Capturar mensagens de texto genéricas
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Verifica se a mensagem é diferente de "/start"
  if (!text.startsWith("/")) {
    bot.sendMessage(chatId, "Por favor, use o menu para interagir com o bot.");
    sendWelcomeMessage(chatId);
  }
});

// Verifica se o bot está conectado
bot.on("polling_error", (error) => {
  console.error("Erro no polling:", error);
});
