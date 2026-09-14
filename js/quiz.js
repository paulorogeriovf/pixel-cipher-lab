// =====================================
// PIXELCIPHER LAB — QUIZ EDUCACIONAL
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    const questions = [
        {
            category: "Fundamentos",
            question: "O que é um pixel?",
            options: [
                "Um formato de arquivo",
                "A menor unidade de uma imagem digital",
                "Um algoritmo de criptografia",
                "Um filtro de nitidez"
            ],
            correct: 1,
            explanation:
                "Pixel é a menor unidade que compõe uma imagem digital e armazena informações de cor."
        },
        {
            category: "Cores RGB",
            question:
                "Quais são os três canais utilizados pelo sistema RGB?",
            options: [
                "Vermelho, verde e azul",
                "Vermelho, cinza e preto",
                "Roxo, verde e amarelo",
                "Preto, branco e azul"
            ],
            correct: 0,
            explanation:
                "RGB significa Red, Green e Blue: vermelho, verde e azul."
        },
        {
            category: "Filtragem",
            question:
                "O que um filtro digital faz em uma imagem?",
            options: [
                "Modifica ou analisa os valores dos pixels",
                "Transforma qualquer imagem em vídeo",
                "Cria obrigatoriamente uma senha",
                "Envia a imagem para um servidor"
            ],
            correct: 0,
            explanation:
                "Filtros digitais realizam operações sobre os pixels para modificar cores, brilho, contraste, bordas ou outros aspectos."
        },
        {
            category: "Filtragem",
            question:
                "Qual filtro normalmente utiliza pixels vizinhos para produzir seu resultado?",
            options: [
                "Separação do canal vermelho",
                "Negativo",
                "Desfoque",
                "Aumento de brilho"
            ],
            correct: 2,
            explanation:
                "O desfoque pode calcular a média dos pixels vizinhos utilizando uma matriz chamada kernel."
        },
        {
            category: "Criptografia",
            question:
                "Qual é o principal objetivo da criptografia?",
            options: [
                "Reduzir a resolução da imagem",
                "Esconder que uma mensagem existe",
                "Tornar uma informação ilegível sem a chave",
                "Aumentar o brilho dos pixels"
            ],
            correct: 2,
            explanation:
                "A criptografia transforma a informação em dados que não devem ser compreendidos sem a chave correta."
        },
        {
            category: "Criptografia",
            question:
                "O que acontece quando uma senha incorreta é utilizada no AES-GCM?",
            options: [
                "A mensagem é recuperada parcialmente",
                "A descriptografia não é autenticada",
                "A imagem é convertida para JPEG",
                "O texto original aparece normalmente"
            ],
            correct: 1,
            explanation:
                "O AES-GCM verifica a autenticidade dos dados. Com uma senha incorreta, a descriptografia falha."
        },
        {
            category: "Esteganografia",
            question:
                "Qual é o principal objetivo da esteganografia?",
            options: [
                "Aumentar a resolução",
                "Ocultar a existência de uma informação",
                "Remover todos os canais RGB",
                "Comprimir uma imagem"
            ],
            correct: 1,
            explanation:
                "A esteganografia busca esconder a existência da mensagem dentro de outro conteúdo."
        },
        {
            category: "Esteganografia",
            question:
                "O que significa LSB no contexto da esteganografia?",
            options: [
                "Large Security Block",
                "Local System Binary",
                "Least Significant Bit",
                "Linear Storage Base"
            ],
            correct: 2,
            explanation:
                "LSB significa Least Significant Bit, ou bit menos significativo."
        },
        {
            category: "Formatos",
            question:
                "Por que o PNG é mais adequado que o JPEG para o método LSB?",
            options: [
                "Porque sempre possui menos pixels",
                "Porque utiliza somente preto e branco",
                "Porque preserva os valores dos pixels sem perdas",
                "Porque não utiliza canais de cores"
            ],
            correct: 2,
            explanation:
                "A compressão sem perdas do PNG preserva os bits inseridos nos canais dos pixels."
        },
        {
            category: "Segurança",
            question:
                "Qual combinação oferece proteção e ocultação da mensagem?",
            options: [
                "Brilho e contraste",
                "JPEG e redimensionamento",
                "Criptografia e esteganografia",
                "Desfoque e detecção de bordas"
            ],
            correct: 2,
            explanation:
                "A criptografia protege o conteúdo, enquanto a esteganografia esconde sua existência."
        }
    ];

    const introduction = document.querySelector("#quiz-introduction");
    const interfaceElement = document.querySelector("#quiz-interface");
    const resultElement = document.querySelector("#quiz-result");

    const startButton = document.querySelector("#start-quiz-button");
    const nextButton = document.querySelector("#next-question-button");
    const restartButton = document.querySelector("#restart-quiz-button");

    const currentQuestionNumber = document.querySelector(
        "#current-question-number"
    );

    const progressDescription = document.querySelector(
        "#progress-description"
    );

    const sidebarProgress = document.querySelector(
        "#sidebar-progress-value"
    );

    const questionNavigation = document.querySelector(
        "#question-navigation"
    );

    const currentScore = document.querySelector("#current-score");
    const questionCategory = document.querySelector("#question-category");
    const questionLabel = document.querySelector("#question-label");
    const questionText = document.querySelector("#question-text");
    const answerOptions = document.querySelector("#answer-options");

    const answerFeedback = document.querySelector("#answer-feedback");
    const feedbackStatus = document.querySelector("#feedback-status");
    const feedbackText = document.querySelector("#feedback-text");

    const finalScore = document.querySelector("#final-score");
    const resultTitle = document.querySelector("#result-title");
    const resultDescription = document.querySelector(
        "#result-description"
    );

    const resultProgress = document.querySelector("#result-progress");

    const resultPercentageText = document.querySelector(
        "#result-percentage-text"
    );

    const reviewList = document.querySelector("#review-list");

    let questionIndex = 0;
    let score = 0;
    let answered = false;
    let answers = [];

    startButton.addEventListener("click", startQuiz);
    nextButton.addEventListener("click", nextQuestion);
    restartButton.addEventListener("click", startQuiz);

    createNavigation();

    function startQuiz() {
        questionIndex = 0;
        score = 0;
        answered = false;
        answers = [];

        introduction.classList.add("hidden");
        resultElement.classList.add("hidden");
        interfaceElement.classList.remove("hidden");

        renderQuestion();

        window.scrollTo({
            top: interfaceElement.offsetTop - 100,
            behavior: "smooth"
        });
    }

    function renderQuestion() {
        answered = false;
        nextButton.disabled = true;

        answerFeedback.classList.add("hidden");
        answerFeedback.classList.remove("error");

        const currentQuestion = questions[questionIndex];
        const displayNumber = String(questionIndex + 1).padStart(2, "0");

        currentQuestionNumber.textContent = displayNumber;

        progressDescription.textContent =
            `Questão ${questionIndex + 1} de ${questions.length}`;

        sidebarProgress.style.width =
            `${((questionIndex + 1) / questions.length) * 100}%`;

        currentScore.textContent = score;
        questionCategory.textContent =
            currentQuestion.category.toUpperCase();

        questionLabel.textContent = `QUESTÃO ${displayNumber}`;
        questionText.textContent = currentQuestion.question;

        answerOptions.innerHTML = "";

        const letters = ["A", "B", "C", "D"];

        currentQuestion.options.forEach((option, optionIndex) => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "answer-option";

            button.innerHTML = `
                <span class="option-letter">
                    ${letters[optionIndex]}
                </span>

                <span>${option}</span>
            `;

            button.addEventListener("click", () => {
                selectAnswer(optionIndex);
            });

            answerOptions.appendChild(button);
        });

        nextButton.innerHTML = questionIndex === questions.length - 1
            ? "Ver resultado <span>→</span>"
            : "Próxima questão <span>→</span>";

        updateNavigation();
    }

    function selectAnswer(selectedIndex) {
        if (answered) {
            return;
        }

        answered = true;

        const currentQuestion = questions[questionIndex];
        const correct = selectedIndex === currentQuestion.correct;

        if (correct) {
            score += 1;
        }

        answers.push({
            selected: selectedIndex,
            correct,
            question: currentQuestion
        });

        const optionButtons = answerOptions.querySelectorAll(
            ".answer-option"
        );

        optionButtons.forEach((button, optionIndex) => {
            button.disabled = true;

            if (optionIndex === currentQuestion.correct) {
                button.classList.add("correct");
            }

            if (
                optionIndex === selectedIndex &&
                optionIndex !== currentQuestion.correct
            ) {
                button.classList.add("incorrect");
            }
        });

        feedbackStatus.textContent = correct
            ? "[CORRETO]"
            : "[RESPOSTA INCORRETA]";

        feedbackText.textContent = currentQuestion.explanation;

        answerFeedback.classList.remove("hidden");
        answerFeedback.classList.toggle("error", !correct);

        currentScore.textContent = score;
        nextButton.disabled = false;

        updateNavigation();
    }

    function nextQuestion() {
        if (!answered) {
            return;
        }

        if (questionIndex < questions.length - 1) {
            questionIndex += 1;
            renderQuestion();

            document.querySelector(".question-card").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return;
        }

        showResult();
    }

    function showResult() {
        interfaceElement.classList.add("hidden");
        resultElement.classList.remove("hidden");

        const percentage = Math.round(
            (score / questions.length) * 100
        );

        finalScore.textContent = score;
        resultPercentageText.textContent = `${percentage}%`;

        setTimeout(() => {
            resultProgress.style.width = `${percentage}%`;
        }, 100);

        if (percentage >= 80) {
            resultTitle.textContent = "Excelente resultado";

            resultDescription.textContent =
                "Você demonstrou domínio dos principais conceitos apresentados.";
        } else if (percentage >= 60) {
            resultTitle.textContent = "Bom resultado";

            resultDescription.textContent =
                "Você compreendeu boa parte do conteúdo, mas ainda pode revisar alguns conceitos.";
        } else {
            resultTitle.textContent = "Continue aprendendo";

            resultDescription.textContent =
                "Revise os módulos e tente novamente para consolidar o aprendizado.";
        }

        createReview();

        window.scrollTo({
            top: resultElement.offsetTop - 100,
            behavior: "smooth"
        });
    }

    function createNavigation() {
        questionNavigation.innerHTML = "";

        questions.forEach((_, index) => {
            const item = document.createElement("span");
            item.textContent = index + 1;

            questionNavigation.appendChild(item);
        });
    }

    function updateNavigation() {
        const items = questionNavigation.querySelectorAll("span");

        items.forEach((item, index) => {
            item.classList.toggle(
                "current",
                index === questionIndex
            );

            item.classList.toggle(
                "answered",
                index < answers.length
            );
        });
    }

    function createReview() {
        reviewList.innerHTML = "";

        answers.forEach((answer, index) => {
            const item = document.createElement("article");

            item.className = answer.correct
                ? "review-item correct"
                : "review-item incorrect";

            const selectedText =
                answer.question.options[answer.selected];

            const correctText =
                answer.question.options[answer.question.correct];

            item.innerHTML = `
                <div class="review-item-header">
                    <h3>
                        ${index + 1}. ${answer.question.question}
                    </h3>

                    <span class="review-status">
                        ${answer.correct ? "[ACERTO]" : "[REVISAR]"}
                    </span>
                </div>

                <p>
                    Sua resposta: ${selectedText}
                </p>

                ${
                    answer.correct
                        ? ""
                        : `<p>Resposta correta: ${correctText}</p>`
                }

                <p>
                    ${answer.question.explanation}
                </p>
            `;

            reviewList.appendChild(item);
        });
    }
});