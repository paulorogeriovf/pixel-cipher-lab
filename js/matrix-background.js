// =====================================
// FUNDO ANIMADO COM CÓDIGOS DIGITAIS
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("#matrix-background");

    if (!canvas) {
        return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
        return;
    }

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const characters =
        "01ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/\\#$%&*+=-";

    let width;
    let height;
    let fontSize;
    let columns;
    let drops;
    let animationFrame;
    let lastFrame = 0;

    function configureCanvas() {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        fontSize = width < 600 ? 16 : 19;
        columns = Math.ceil(width / fontSize);

        drops = Array.from(
            { length: columns },
            () => Math.random() * (height / fontSize)
        );
    }

    function drawMatrix(timestamp = 0) {
        if (timestamp - lastFrame < 65) {
            animationFrame = requestAnimationFrame(drawMatrix);
            return;
        }

        lastFrame = timestamp;

        context.fillStyle = "rgba(3, 6, 4, 0.09)";
        context.fillRect(0, 0, width, height);

        context.fillStyle = "#00ff66";
        context.font = `${fontSize}px "Cascadia Code", Consolas, monospace`;

        drops.forEach((drop, index) => {
            const character = characters.charAt(
                Math.floor(Math.random() * characters.length)
            );

            const x = index * fontSize;
            const y = height - drop * fontSize;

            context.globalAlpha = Math.random() * 0.5 + 0.2;
            context.fillText(character, x, y);

            drops[index] += 0.45 + Math.random() * 0.35;

            if (y < -fontSize || Math.random() > 0.996) {
                drops[index] = 0;
            }
        });

        context.globalAlpha = 1;
        animationFrame = requestAnimationFrame(drawMatrix);
    }

    function drawStaticBackground() {
        context.clearRect(0, 0, width, height);
        context.fillStyle = "rgba(0, 255, 102, 0.35)";
        context.font = `${fontSize}px "Cascadia Code", Consolas, monospace`;

        drops.forEach((drop, index) => {
            const character = characters.charAt(
                Math.floor(Math.random() * characters.length)
            );

            const x = index * fontSize;
            const y = Math.random() * height;

            context.fillText(character, x, y);
        });
    }

    function handleResize() {
        cancelAnimationFrame(animationFrame);
        configureCanvas();

        if (reduceMotion) {
            drawStaticBackground();
        } else {
            drawMatrix();
        }
    }

    configureCanvas();

    if (reduceMotion) {
        drawStaticBackground();
    } else {
        drawMatrix();
    }

    window.addEventListener("resize", handleResize);
});