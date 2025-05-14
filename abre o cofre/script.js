const pistas = [5, 12, 33, 9];
const charadas = [
  "Sou menor que 10, ímpar, e estou entre 4 e 6. Quem sou eu?",
  "Meu avô tem 5 filhos, cada filho tem 3 filhos. Quantos primos eu tenho?",
  "Qual o número da sequência 3, 13, 30, 31, 32 ... ?",
  "Sou o quadrado de 3. Quem sou eu?"
];

const dicas = [
  "A resposta é um número entre 4 e 6.",
  "A resposta é 5 vezes 3.",
  "O número seguinte é 33.",
  "A resposta é 9."
];

let pistasEncontradas = [];
let senhaDigitada = "";

function revelarPista(index) {
  const btn = document.getElementsByClassName("pista")[index];
  btn.disabled = true;
  pistasEncontradas[index] = pistas[index];

  const container = document.getElementById("pistas-reveladas");
  const carta = document.createElement("div");
  carta.className = "carta";
  carta.innerHTML = `<strong>Pista ${index + 1}</strong><br>${charadas[index]}<br><br>Ajuda para conversão:<br><code>${pistas[index]} = ${decimalParaBinario(pistas[index])} (binário)</code><br><br><button onclick="mostrarDica(${index})">Dica</button>`;
  container.appendChild(carta);
}

function mostrarDica(index) {
  alert(dicas[index]);
}

function decimalParaBinario(n) {
  return n.toString(2).padStart(4, '0');
}

function digitar(valor) {
  senhaDigitada += valor;
  atualizarDisplay();
}

function apagar() {
  senhaDigitada = senhaDigitada.slice(0, -1);
  atualizarDisplay();
}

function atualizarDisplay() {
  document.getElementById("displaySenha").value = senhaDigitada;
}

function atualizarSenhaManual(valor) {
  senhaDigitada = valor.replace(/[^01]/g, "");
  atualizarDisplay();
}

function verificarSenha() {
  const senhaCorreta = pistas.map(decimalParaBinario).join('');

  if (senhaDigitada === senhaCorreta) {
    document.getElementById("resultado").innerText = "✨ Cofre Aberto! Parabéns! ✨";
    document.getElementById("cofre").style.display = "block";
  } else {
    document.getElementById("resultado").innerText = "Senha incorreta! Tente novamente.";
    document.getElementById("cofre").style.display = "none";
  }
  senhaDigitada = "";
  atualizarDisplay();
}
