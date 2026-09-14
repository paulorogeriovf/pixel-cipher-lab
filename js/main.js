// =====================================
// PIXELCIPHER LAB — COMPORTAMENTOS GERAIS
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    configurarCabecalho();
    configurarMenuMobile();
    configurarAnoAtual();
    iniciarDigitacaoTerminal();
});

// Adiciona um fundo escuro ao cabeçalho após a rolagem.
function configurarCabecalho() {
    const header = document.querySelector(".header");

    if (!header) {
        return;
    }

    function atualizarCabecalho() {
        header.classList.toggle("scrolled", window.scrollY > 20);
    }

    atualizarCabecalho();

    window.addEventListener("scroll", atualizarCabecalho);
}

// Controla a abertura e o fechamento do menu no celular.
function configurarMenuMobile() {
    const menuButton = document.querySelector("#menu-button");
    const navigation = document.querySelector("#navigation");

    if (!menuButton || !navigation) {
        return;
    }

    function fecharMenu() {
        navigation.classList.remove("open");
        menuButton.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    }

    menuButton.addEventListener("click", () => {
        const menuAberto = navigation.classList.toggle("open");

        menuButton.classList.toggle("active", menuAberto);
        menuButton.setAttribute("aria-expanded", String(menuAberto));
        document.body.classList.toggle("menu-open", menuAberto);
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", fecharMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 960) {
            fecharMenu();
        }
    });
}

// Insere automaticamente o ano atual no rodapé.
function configurarAnoAtual() {
    const currentYear = document.querySelector("#current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

// Simula a escrita de comandos dentro do terminal.
function iniciarDigitacaoTerminal() {
    const terminalCommand = document.querySelector("#terminal-command");

    if (!terminalCommand) {
        return;
    }

    const commands = [
        "explorar_pixels",
        "aplicar_filtros",
        "criptografar_mensagem",
        "ocultar_dados --metodo lsb"
    ];

    let commandIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function type() {
        const currentCommand = commands[commandIndex];

        if (!deleting) {
            characterIndex += 1;
            terminalCommand.textContent = currentCommand.slice(
                0,
                characterIndex
            );

            if (characterIndex === currentCommand.length) {
                deleting = true;
                setTimeout(type, 1500);
                return;
            }
        } else {
            characterIndex -= 1;
            terminalCommand.textContent = currentCommand.slice(
                0,
                characterIndex
            );

            if (characterIndex === 0) {
                deleting = false;
                commandIndex = (commandIndex + 1) % commands.length;
            }
        }

        const delay = deleting ? 35 : 70;
        setTimeout(type, delay);
    }

    type();
}