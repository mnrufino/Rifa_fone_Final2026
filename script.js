const SENHA_ADMIN = "1234";

const areaNumeros = document.getElementById("numeros");
const numerosEscolhidos = document.getElementById("numerosEscolhidos");
const mensagem = document.getElementById("mensagem");
const listaCompradores = document.getElementById("listaCompradores");

let selecionados = [];
let vendidos = JSON.parse(localStorage.getItem("rifaCompradores")) || [];

function salvarVendidos() {
  localStorage.setItem("rifaCompradores", JSON.stringify(vendidos));
}

function numeroJaVendido(numero) {
  return vendidos.some(item => item.numero === numero);
}

function atualizarCampoSelecionados() {
  numerosEscolhidos.value = selecionados.join(", ");
}

function criarNumeros() {
  areaNumeros.innerHTML = "";

  for (let i = 1; i <= 200; i++) {
    const numero = String(i).padStart(3, "0");
    const botao = document.createElement("button");

    botao.className = "numero";
    botao.textContent = numero;

    if (numeroJaVendido(numero)) {
      botao.classList.add("vendido");
      botao.disabled = true;
    }

    botao.addEventListener("click", function () {
      if (botao.classList.contains("vendido")) return;

      if (selecionados.includes(numero)) {
        selecionados = selecionados.filter(item => item !== numero);
        botao.classList.remove("selecionado");
      } else {
        selecionados.push(numero);
        botao.classList.add("selecionado");
      }

      atualizarCampoSelecionados();
      mensagem.textContent = "";
    });

    areaNumeros.appendChild(botao);
  }
}

function confirmarParticipacao() {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if (!nome || !telefone || selecionados.length === 0) {
    mensagem.textContent = "Preencha nome, telefone e escolha pelo menos um número.";
    mensagem.style.color = "red";
    return;
  }

  const data = new Date().toLocaleString("pt-BR");

  selecionados.forEach(numero => {
    if (!numeroJaVendido(numero)) {
      vendidos.push({ numero, nome, telefone, data });
    }
  });

  salvarVendidos();

  mensagem.textContent = `Participação confirmada: ${nome} - Números ${selecionados.join(", ")}`;
  mensagem.style.color = "green";

  selecionados = [];
  atualizarCampoSelecionados();

  document.getElementById("nome").value = "";
  document.getElementById("telefone").value = "";

  criarNumeros();
  atualizarListaCompradores();
}

function enviarWhatsApp() {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if (!nome || !telefone || selecionados.length === 0) {
    mensagem.textContent = "Preencha nome, telefone e escolha pelo menos um número antes de enviar.";
    mensagem.style.color = "red";
    return;
  }

  const texto = `Olá! Quero participar da rifa.%0A%0ANome: ${nome}%0ATelefone: ${telefone}%0ANúmeros escolhidos: ${selecionados.join(", ")}`;
  window.open(`https://wa.me/?text=${texto}`, "_blank");
}

function limparSelecao() {
  selecionados = [];
  document.querySelectorAll(".numero.selecionado").forEach(botao => {
    botao.classList.remove("selecionado");
  });

  atualizarCampoSelecionados();
  mensagem.textContent = "Seleção limpa.";
  mensagem.style.color = "#555";
}

function entrarAdmin() {
  const senha = document.getElementById("senhaAdmin").value;

  if (senha !== SENHA_ADMIN) {
    alert("Senha incorreta.");
    return;
  }

  document.getElementById("loginAdmin").classList.add("oculto");
  document.getElementById("painelAdmin").classList.remove("oculto");
  atualizarListaCompradores();
}

function sairAdmin() {
  document.getElementById("senhaAdmin").value = "";
  document.getElementById("loginAdmin").classList.remove("oculto");
  document.getElementById("painelAdmin").classList.add("oculto");
}

function atualizarListaCompradores() {
  listaCompradores.innerHTML = "";

  if (vendidos.length === 0) {
    listaCompradores.innerHTML = `<tr><td colspan="5">Nenhum número vendido ainda.</td></tr>`;
    return;
  }

  vendidos
    .sort((a, b) => a.numero.localeCompare(b.numero))
    .forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.numero}</td>
        <td>${item.nome}</td>
        <td>${item.telefone}</td>
        <td>${item.data || ""}</td>
        <td><button onclick="removerNumero('${item.numero}')">Remover</button></td>
      `;
      listaCompradores.appendChild(tr);
    });
}

function removerNumero(numero) {
  const confirmar = confirm(`Deseja remover o número ${numero} da lista de vendidos?`);
  if (!confirmar) return;

  vendidos = vendidos.filter(item => item.numero !== numero);
  salvarVendidos();
  criarNumeros();
  atualizarListaCompradores();
}

function exportarCSV() {
  if (vendidos.length === 0) {
    alert("Não há compradores para exportar.");
    return;
  }

  let csv = "Numero,Nome,Telefone,Data\\n";

  vendidos
    .sort((a, b) => a.numero.localeCompare(b.numero))
    .forEach(item => {
      csv += `${item.numero},"${item.nome}","${item.telefone}","${item.data || ""}"\\n`;
    });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "compradores_rifa.csv";
  link.click();
}

function limparRifa() {
  const confirmar = confirm("Tem certeza que deseja apagar todos os números vendidos e compradores?");
  if (!confirmar) return;

  vendidos = [];
  selecionados = [];
  salvarVendidos();
  atualizarCampoSelecionados();
  criarNumeros();
  atualizarListaCompradores();

  mensagem.textContent = "Todos os dados foram apagados.";
  mensagem.style.color = "green";
}

criarNumeros();
atualizarListaCompradores();
