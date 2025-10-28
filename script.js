const chatButton = document.querySelector(".chat-button");
const chatWindow = document.querySelector(".chat-window");
const chatMessages = document.querySelector(".chat-messages");
const chatInput = document.querySelector(".chat-input input");
const chatSend = document.querySelector(".chat-input button");

// Abre e fecha o chat
chatButton.addEventListener("click", () => {
  chatWindow.style.display =
    chatWindow.style.display === "flex" ? "none" : "flex";
  chatWindow.style.flexDirection = "column";

  if (chatMessages.innerHTML === "") {
    addMessage("Olá! Como posso ajudar você hoje?", "bot");
    showOptions();
  }
});

// Envia a mensagem
chatSend.addEventListener("click", enviarMensagem);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") enviarMensagem();
});

function enviarMensagem() {
  const texto = chatInput.value.trim();
  if (texto === "") return;

  addMessage(texto, "user");
  chatInput.value = "";

  setTimeout(() => processarResposta(texto.toLowerCase()), 600);
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showOptions() {
  const optionsContainer = document.createElement("div");
  optionsContainer.classList.add("bot-options");

  const options = [
    { text: "Ver horários", action: () => mostrarHorarios() },
    { text: "Ver produtos", action: () => mostrarProdutos() },
    { text: "Falar com atendente", action: () => falarComAtendente() },
  ];

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.classList.add("bot-option");
    btn.textContent = opt.text;
    btn.onclick = () => {
      addMessage(opt.text, "user");
      optionsContainer.remove();
      setTimeout(opt.action, 500);
    };
    optionsContainer.appendChild(btn);
  });

  chatMessages.appendChild(optionsContainer);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processarResposta(texto) {
  if (texto.includes("horário")) {
    mostrarHorarios();
  } else if (texto.includes("produto")) {
    mostrarProdutos();
  } else {
    buscarProdutoPorNome(texto);
  }
}

function mostrarHorarios() {
  addMessage(
    "Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.",
    "bot"
  );
  showOptions();
}

// Busca produtos do arquivo JSON
async function mostrarProdutos() {
  addMessage("Carregando produtos...", "bot");

  try {
    const resposta = await fetch("produtos.json");
    const produtos = await resposta.json();

    if (produtos.length === 0) {
      addMessage("Nenhum produto encontrado no momento.", "bot");
    } else {
      let lista = produtos
        .map((p, i) => `${i + 1}. ${p.nome} - R$ ${p.preco.toFixed(2)}`)
        .join("\n");
      addMessage("Temos os seguintes produtos disponíveis:", "bot");
      addMessage(lista, "bot");
    }
  } catch (erro) {
    console.error(erro);
    addMessage("Não foi possível carregar os produtos.", "bot");
  }

  showOptions();
}

// Busca produto pelo nome digitado
async function buscarProdutoPorNome(texto) {
  try {
    const resposta = await fetch("produtos.json");
    const produtos = await resposta.json();

    const produto = produtos.find((p) => texto.includes(p.nome.toLowerCase()));

    if (produto) {
      addMessage(
        `O produto "${
          produto.nome
        }" está disponível por R$ ${produto.preco.toFixed(2)}.`,
        "bot"
      );
    } else {
      addMessage(
        "Desculpe, não encontrei esse produto. Você pode ver todos abaixo:",
        "bot"
      );
      mostrarProdutos();
    }
  } catch (erro) {
    addMessage("Erro ao buscar os produtos.", "bot");
  }
}

function falarComAtendente() {
  addMessage(
    "Um atendente será conectado em breve. Por favor, aguarde alguns instantes.",
    "bot"
  );
}
