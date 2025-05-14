let acertos = 0;
let timer = 60;
let intervalo;
let numeroDecimal;
let numeroBinario;
let jogoAtivo = false;

function toggleLamp(potencia) {
    if (!jogoAtivo) return;

    const lanterna = document.getElementById(`lanterna${potencia}`);
    if (lanterna.classList.contains('acesa')) {
        lanterna.classList.remove('acesa');
        lanterna.classList.add('apagada');
    } else {
        lanterna.classList.remove('apagada');
        lanterna.classList.add('acesa');
    }

    verificarAcerto();
}

function iniciarJogo() {
    jogoAtivo = true;
    acertos = 0;
    timer = 60;
    document.getElementById('placar').textContent = `Placar: ${acertos}`;
    document.getElementById('timer').textContent = `Tempo: ${timer}`;
    resetarLamps();

    // Gerar número decimal aleatório entre 1 e 15
    numeroDecimal = Math.floor(Math.random() * 15) + 1;
    numeroBinario = numeroDecimal.toString(2).padStart(4, '0'); // 4 bits
    document.getElementById('numeroDisplay').textContent = `Número: ${numeroDecimal}`;

    intervalo = setInterval(decrementarTempo, 1000);
}

function resetarLamps() {
    const lanternas = document.querySelectorAll('.lanterna');
    lanternas.forEach(lanterna => {
        lanterna.classList.remove('acesa');
        lanterna.classList.add('apagada');
    });
}

function verificarAcerto() {
    const lanternas = [
        document.getElementById('lanterna8'),
        document.getElementById('lanterna4'),
        document.getElementById('lanterna2'),
        document.getElementById('lanterna1')
    ];

    let numeroFormado = 0;

    lanternas.forEach((lanterna, index) => {
        if (lanterna.classList.contains('acesa')) {
            numeroFormado += Math.pow(2, 3 - index); // 8, 4, 2, 1
        }
    });

    if (numeroFormado === numeroDecimal) {
        acertos++;
        document.getElementById('placar').textContent = `Placar: ${acertos}`;
        numeroDecimal = Math.floor(Math.random() * 15) + 1;
        numeroBinario = numeroDecimal.toString(2).padStart(4, '0');
        document.getElementById('numeroDisplay').textContent = `Número: ${numeroDecimal}`;
        resetarLamps();
    }
}

function decrementarTempo() {
    timer--;
    document.getElementById('timer').textContent = `Tempo: ${timer}`;
    
    if (timer <= 0) {
        clearInterval(intervalo);
        jogoAtivo = false;
        alert(`Tempo esgotado! Você fez ${acertos} acertos.`);
    }
}
