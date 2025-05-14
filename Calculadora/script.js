const input = document.getElementById('decimalInput');
const button = document.getElementById('convertBtn');
const stepsContainer = document.getElementById('steps');

button.addEventListener('click', () => {
  const num = parseInt(input.value, 10);
  stepsContainer.innerHTML = '';

  if (isNaN(num) || num < 0) {
    const error = document.createElement('div');
    error.className = 'step';
    error.textContent = 'Por favor, digite um número inteiro não-negativo.';
    stepsContainer.appendChild(error);
    return;
  }

  let n = num;
  const remainders = [];
  let stepCount = 1;

  // Explicação inicial
  const intro = document.createElement('div');
  intro.className = 'step';
  intro.innerHTML = `Iniciando a conversão de <strong>${num}</strong> para binário.`;
  stepsContainer.appendChild(intro);

  // Processo de conversão
  while (n > 0) {
    const remainder = n % 2;
    remainders.push(remainder);

    const step = document.createElement('div');
    step.className = 'step';
    step.innerHTML = `Passo ${stepCount}: ${n} ÷ 2 = ${Math.floor(n / 2)} (quociente) com resto <strong>${remainder}</strong>.`;
    stepsContainer.appendChild(step);

    n = Math.floor(n / 2);
    stepCount++;
  }

  // Remainders reversed
  const binary = remainders.reverse().join('');
  const result = document.createElement('div');
  result.className = 'step';
  result.innerHTML = `<strong>Resultado:</strong> os restos de baixo para cima formam <span class="binary">${binary}</span>.`;
  stepsContainer.appendChild(result);
});