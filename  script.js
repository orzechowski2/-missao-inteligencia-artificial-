// ===== CALCULADORA DE IMPACTO =====
function calcularImpacto() {
    const banhos = parseFloat(document.getElementById('banhos').value) || 0;
    const km = parseFloat(document.getElementById('km').value) || 0;
    const horas = parseFloat(document.getElementById('horas').value) || 0;

    // Fórmulas simplificadas (valores aproximados)
    const aguaPorBanho = 60; // litros
    const co2PorKm = 0.12;   // kg CO2 por km
    const co2PorHora = 0.05; // kg CO2 por hora eletrônico

    const litrosAgua = banhos * aguaPorBanho * 30; // mensal
    const co2Carro = km * co2PorKm * 30;
    const co2Eletronicos = horas * co2PorHora * 30;
    const co2Total = co2Carro + co2Eletronicos;

    const arvoresNecessarias = Math.ceil(co2Total / 22); // 22kg por árvore/ano

    const resultado = document.getElementById('resultado');
    resultado.style.display = 'block';
    resultado.innerHTML = `
        🌊 <strong>Água:</strong> você consome cerca de <strong>${litrosAgua.toFixed(0)} litros</strong> por mês só em banhos.<br>
        🌫️ <strong>Emissão de CO₂:</strong> aproximadamente <strong>${co2Total.toFixed(1)} kg</strong> por mês.<br>
        🌳 <strong>Para compensar:</strong> você precisaria plantar <strong>${arvoresNecessarias} árvore(s)</strong> por ano.<br><br>
        💡 <em>Pequenas mudanças nos hábitos fazem uma grande diferença!</em>
    `;
}

// ===== QUIZ INTERATIVO =====
const perguntas = [
    {
        pergunta: "Quanto tempo uma sacola plástica leva para se decompor?",
        opcoes: ["5 anos", "50 anos", "400 anos", "10 anos"],
        correta: 2
    },
    {
        pergunta: "Qual atitude economiza mais água?",
        opcoes: ["Banho de 15 min", "Fechar a torneira ao escovar", "Lavar o carro com mangueira", "Regar plantas ao meio-dia"],
        correta: 1
    },
    {
        pergunta: "Qual gás é o principal causador do efeito estufa?",
        opcoes: ["Oxigênio (O₂)", "Nitrogênio (N₂)", "Dióxido de Carbono (CO₂)", "Hélio (He)"],
        correta: 2
    }
];

let indiceAtual = 0;
let acertos = 0;

function renderizarQuiz() {
    const quizDiv = document.getElementById('quiz');

    if (indiceAtual >= perguntas.length) {
        const porcentagem = Math.round((acertos / perguntas.length) * 100);
        let mensagem = "";
        if (porcentagem === 100) mensagem = "🌟 Perfeito! Você é um guardião do planeta!";
        else if (porcentagem >= 66) mensagem = "💚 Muito bem! Continue aprendendo!";
        else mensagem = "🌱 Que tal revisar nossas dicas acima?";

        quizDiv.innerHTML = `
            <h3>🏆 Resultado Final</h3>
            <p style="font-size: 1.3rem; margin: 1rem 0; color: #2d6a4f;">
                Você acertou <strong>${acertos}/${perguntas.length}</strong> (${porcentagem}%)
            </p>
            <p style="font-size: 1.1rem; color: #52b788;">${mensagem}</p>
            <button class="btn-calc" style="margin-top: 1.5rem;" onclick="reiniciarQuiz()">Refazer Quiz 🔄</button>
        `;
        return;
    }

    const p = perguntas[indiceAtual];
    quizDiv.innerHTML = `
        <h3>Pergunta ${indiceAtual + 1}/${perguntas.length}: ${p.pergunta}</h3>
        ${p.opcoes.map((op, i) =>
            `<button class="quiz-opcao" onclick="responder(${i})">${op}</button>`
        ).join('')}
    `;
}

function responder(escolhida) {
    const p = perguntas[indiceAtual];
    const botoes = document.querySelectorAll('.quiz-opcao');

    botoes.forEach((btn, i) => {
        btn.disabled = true;
        if (i === p.correta) btn.classList.add('correta');
        else if (i === escolhida) btn.classList.add('errada');
    });

    if (escolhida === p.correta) acertos++;

    setTimeout(() => {
        indiceAtual++;
        renderizarQuiz();
    }, 1500);
}

function reiniciarQuiz() {
    indiceAtual = 0;
    acertos = 0;
    renderizarQuiz();
}

// ===== CONTADOR ANIMADO =====
function animarContador(elemento, alvo) {
    const duracao = 2000;
    const incremento = alvo / (duracao / 16);
    let atual = 0;

    const timer = setInterval(() => {
        atual += incremento;
        if (atual >= alvo) {
            atual = alvo;
            clearInterval(timer);
        }
        elemento.textContent = formatarNumero(Math.floor(atual));
    }, 16);
}

function formatarNumero(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(0) + "mil";
    return n.toString();
}

// ===== OBSERVER PARA ANIMAÇÕES AO ROLAR =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Anima contadores
            if (entry.target.classList.contains('contador-impacto')) {
                entry.target.querySelectorAll('.numero').forEach(num => {
                    const alvo = parseInt(num.dataset.target);
                    animarContador(num, alvo);
                });
            }
            // Anima cards
            entry.target.querySelectorAll('.card').forEach((card, i) => {
                card.style.animation = `fadeUp 0.6s ease ${i * 0.1}s backwards`;
            });
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

// ===== COMPARTILHAR =====
function compartilhar() {
    const texto = "🌍 Cuide do meio ambiente! Pequenas atitudes geram grandes transformações. 💚";
    if (navigator.share) {
        navigator.share({ title: 'Cuide do Meio Ambiente', text: texto });
    } else {
        navigator.clipboard.writeText(texto);
        alert("✅ Mensagem copiada! Compartilhe com seus amigos 🌱");
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    renderizarQuiz();
    observer.observe(document.querySelector('.contador-impacto'));
    observer.observe(document.querySelector('.cards'));
});