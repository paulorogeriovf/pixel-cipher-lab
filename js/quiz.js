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
                "Uma unidade que compõe uma imagem digital",
                "Um algoritmo de criptografia",
                "Um filtro de nitidez"
            ],
            correct: 1,
            explanation:
                "Uma imagem digital é organizada em pixels. Cada pixel representa uma posição da imagem e contém informações utilizadas para determinar sua cor."
        },
        {
            category: "Cores RGB",
            question: "Quais são os três canais utilizados pelo sistema RGB?",
            options: [
                "Vermelho, verde e azul",
                "Vermelho, cinza e preto",
                "Roxo, verde e amarelo",
                "Preto, branco e azul"
            ],
            correct: 0,
            explanation:
                "RGB vem de Red, Green e Blue: vermelho, verde e azul. A combinação dos valores desses canais representa diferentes cores."
        },
        {
            category: "Filtragem",
            question: "O que um filtro digital faz em uma imagem?",
            options: [
                "Modifica ou analisa os valores dos pixels",
                "Transforma qualquer imagem em vídeo",
                "Cria obrigatoriamente uma senha",
                "Envia a imagem para um servidor"
            ],
            correct: 0,
            explanation:
                "Um filtro realiza operações sobre os pixels para modificar ou analisar características como brilho, cor, contraste, nitidez e bordas."
        },
        {
            category: "Filtragem",
            question: "Qual filtro normalmente utiliza pixels vizinhos para produzir seu resultado?",
            options: [
                "Separação do canal vermelho",
                "Negativo",
                "Desfoque",
                "Aumento de brilho"
            ],
            correct: 2,
            explanation:
                "Um desfoque pode combinar os valores de pixels vizinhos. Uma forma de fazer isso é aplicar uma matriz de valores, chamada kernel, sobre a imagem."
        },
        {
            category: "Criptografia",
            question: "Qual é o principal objetivo da criptografia?",
            options: [
                "Reduzir a resolução da imagem",
                "Esconder que uma mensagem existe",
                "Proteger a leitura de uma informação sem a chave correta",
                "Aumentar o brilho dos pixels"
            ],
            correct: 2,
            explanation:
                "A criptografia transforma a informação em dados cifrados. Sem a chave correta, seu conteúdo não deve poder ser recuperado."
        },
        {
            category: "Criptografia",
            question: "O que ocorre ao tentar recuperar dados protegidos por AES-GCM com uma senha incorreta?",
            options: [
                "A mensagem é recuperada parcialmente",
                "A verificação falha e a mensagem não é recuperada",
                "A imagem é automaticamente convertida para JPEG",
                "O texto original aparece normalmente"
            ],
            correct: 1,
            explanation:
                "O AES-GCM também verifica a integridade e a autenticidade dos dados. Com a senha incorreta, a operação falha em vez de apresentar o texto original."
        },
        {
            category: "Esteganografia",
            question: "Qual é o principal objetivo da esteganografia?",
            options: [
                "Aumentar a resolução de uma imagem",
                "Ocultar a presença de uma informação em outro conteúdo",
                "Remover todos os canais RGB",
                "Comprimir obrigatoriamente uma imagem"
            ],
            correct: 1,
            explanation:
                "A esteganografia insere uma informação em um suporte, como uma imagem, buscando dificultar a percepção de que os dados estão ali."
        },
        {
            category: "Esteganografia",
            question: "O que significa LSB no contexto da esteganografia?",
            options: [
                "Large Security Block",
                "Local System Binary",
                "Least Significant Bit",
                "Linear Storage Base"
            ],
            correct: 2,
            explanation:
                "LSB significa Least Significant Bit, ou bit menos significativo. Alterar esse bit em um canal RGB modifica seu valor em, no máximo, uma unidade."
        },
        {
            category: "Formatos",
            question: "Por que o PNG é mais adequado que o JPEG para preservar uma mensagem inserida por LSB?",
            options: [
                "Porque sempre possui menos pixels",
                "Porque utiliza somente preto e branco",
                "Porque pode preservar os valores dos pixels sem perdas",
                "Porque não utiliza canais de cor"
            ],
            correct: 2,
            explanation:
                "O PNG utiliza compressão sem perdas e preserva os valores dos pixels. A compressão do JPEG pode modificar os bits utilizados para armazenar a mensagem."
        },
        {
            category: "Segurança",
            question: "Qual combinação protege a leitura da mensagem e também permite escondê-la em uma imagem?",
            options: [
                "Brilho e contraste",
                "JPEG e redimensionamento",
                "Criptografia e esteganografia",
                "Desfoque e detecção de bordas"
            ],
            correct: 2,
            explanation:
                "A criptografia protege o conteúdo da mensagem. A esteganografia insere os dados em outro conteúdo, como uma imagem. As técnicas possuem funções diferentes e podem ser combinadas."
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

        resultProgress.style.width = "0%";

        renderQuestion();

        window.scrollTo({
            top: Math.max(0, interfaceElement.offsetTop - 100),
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

        answerOptions.replaceChildren();

        const letters = ["A", "B", "C", "D"];

        currentQuestion.options.forEach((option, optionIndex) => {
            const button = document.createElement("button");
            const letter = document.createElement("span");
            const optionText = document.createElement("span");

            button.type = "button";
            button.className = "answer-option";

            letter.className = "option-letter";
            letter.textContent = letters[optionIndex];
            optionText.textContent = option;

            button.append(letter, optionText);

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
                "Você acertou a maior parte das questões. Confira a revisão para reforçar os conceitos.";
        } else if (percentage >= 60) {
            resultTitle.textContent = "Bom resultado";
            resultDescription.textContent =
                "Você acertou boa parte das questões. Leia as explicações e revise os assuntos que geraram dúvidas.";
        } else {
            resultTitle.textContent = "Continue aprendendo";
            resultDescription.textContent =
                "Use a revisão para identificar suas dúvidas, retorne aos módulos e tente novamente.";
        }

        createReview();

        window.scrollTo({
            top: Math.max(0, resultElement.offsetTop - 100),
            behavior: "smooth"
        });
    }

    function createNavigation() {
        questionNavigation.replaceChildren();

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
        reviewList.replaceChildren();

        answers.forEach((answer, index) => {
            const item = document.createElement("article");
            const header = document.createElement("div");
            const heading = document.createElement("h3");
            const status = document.createElement("span");

            item.className = answer.correct
                ? "review-item correct"
                : "review-item incorrect";

            header.className = "review-item-header";
            heading.textContent =
                `${index + 1}. ${answer.question.question}`;

            status.className = "review-status";
            status.textContent = answer.correct
                ? "[ACERTO]"
                : "[REVISAR]";

            header.append(heading, status);
            item.appendChild(header);

            const selectedAnswer = document.createElement("p");
            selectedAnswer.textContent =
                `Sua resposta: ${answer.question.options[answer.selected]}`;

            item.appendChild(selectedAnswer);

            if (!answer.correct) {
                const correctAnswer = document.createElement("p");

                correctAnswer.textContent =
                    `Resposta correta: ${answer.question.options[answer.question.correct]}`;

                item.appendChild(correctAnswer);
            }

            const explanation = document.createElement("p");
            explanation.textContent = answer.question.explanation;

            item.appendChild(explanation);
            reviewList.appendChild(item);
        });
    }
});