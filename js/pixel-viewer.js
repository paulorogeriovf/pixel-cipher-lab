// =========================================
// VISUALIZADOR INTERATIVO DE PIXELS E RGB
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("#pixel-canvas");

    if (!canvas) {
        return;
    }

    const context = canvas.getContext("2d", {
        willReadFrequently: true
    });

    const elements = {
        cursor: document.querySelector("#pixel-cursor"),
        preview: document.querySelector("#selected-color-preview"),
        hex: document.querySelector("#hex-value"),
        positionX: document.querySelector("#position-x"),
        positionY: document.querySelector("#position-y"),
        red: document.querySelector("#red-value"),
        green: document.querySelector("#green-value"),
        blue: document.querySelector("#blue-value"),
        binaryRed: document.querySelector("#binary-red"),
        binaryGreen: document.querySelector("#binary-green"),
        binaryBlue: document.querySelector("#binary-blue")
    };

    createVirtualImage();

    canvas.addEventListener("mousemove", inspectPixel);
    canvas.addEventListener("mouseleave", hideCursor);
    canvas.addEventListener("touchstart", inspectTouchPixel, {
        passive: false
    });

    canvas.addEventListener("touchmove", inspectTouchPixel, {
        passive: false
    });

    function createVirtualImage() {
        const width = canvas.width;
        const height = canvas.height;

        // Fundo em gradiente.
        const gradient = context.createLinearGradient(
            0,
            0,
            width,
            height
        );

        gradient.addColorStop(0, "#02150a");
        gradient.addColorStop(0.45, "#00a844");
        gradient.addColorStop(1, "#001b33");

        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);

        // Círculo luminoso.
        const radialGradient = context.createRadialGradient(
            115,
            95,
            10,
            115,
            95,
            105
        );

        radialGradient.addColorStop(0, "#d9ffe8");
        radialGradient.addColorStop(0.2, "#00ff66");
        radialGradient.addColorStop(1, "rgba(0, 255, 102, 0)");

        context.fillStyle = radialGradient;
        context.fillRect(0, 0, width, height);

        // Formas geométricas para criar variação de pixels.
        context.fillStyle = "rgba(0, 0, 0, 0.62)";
        context.fillRect(225, 45, 125, 125);

        context.strokeStyle = "#00ff66";
        context.lineWidth = 5;
        context.strokeRect(225, 45, 125, 125);

        context.fillStyle = "#041008";
        context.beginPath();
        context.moveTo(195, 235);
        context.lineTo(280, 130);
        context.lineTo(365, 235);
        context.closePath();
        context.fill();

        context.strokeStyle = "#70ffa9";
        context.lineWidth = 4;
        context.stroke();

        // Pequenos pixels.
        const blocks = [
            [26, 210, "#00ff66"],
            [48, 210, "#008a39"],
            [70, 210, "#73ffa9"],
            [48, 232, "#005d28"],
            [70, 232, "#00ff66"],
            [92, 232, "#003f1c"]
        ];

        blocks.forEach(([x, y, color]) => {
            context.fillStyle = color;
            context.fillRect(x, y, 18, 18);
        });

        // Linhas de varredura.
        context.fillStyle = "rgba(0, 0, 0, 0.1)";

        for (let y = 0; y < height; y += 4) {
            context.fillRect(0, y, width, 1);
        }

        updatePixelInformation(0, 0, 0, 0, 0);
    }

    function inspectPixel(event) {
        const coordinates = getCanvasCoordinates(
            event.clientX,
            event.clientY
        );

        inspectCoordinates(coordinates);
    }

    function inspectTouchPixel(event) {
        event.preventDefault();

        const touch = event.touches[0];

        if (!touch) {
            return;
        }

        const coordinates = getCanvasCoordinates(
            touch.clientX,
            touch.clientY
        );

        inspectCoordinates(coordinates);
    }

    function getCanvasCoordinates(clientX, clientY) {
        const rectangle = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rectangle.width;
        const scaleY = canvas.height / rectangle.height;

        const x = Math.floor(
            (clientX - rectangle.left) * scaleX
        );

        const y = Math.floor(
            (clientY - rectangle.top) * scaleY
        );

        return {
            x: Math.max(0, Math.min(canvas.width - 1, x)),
            y: Math.max(0, Math.min(canvas.height - 1, y)),
            displayX: clientX - rectangle.left,
            displayY: clientY - rectangle.top
        };
    }

    function inspectCoordinates(coordinates) {
        const pixel = context.getImageData(
            coordinates.x,
            coordinates.y,
            1,
            1
        ).data;

        const [red, green, blue] = pixel;

        updatePixelInformation(
            coordinates.x,
            coordinates.y,
            red,
            green,
            blue
        );

        showCursor(
            coordinates.displayX,
            coordinates.displayY
        );
    }

    function updatePixelInformation(x, y, red, green, blue) {
        const hexColor = convertToHex(red, green, blue);

        elements.positionX.textContent = x;
        elements.positionY.textContent = y;

        elements.red.textContent = red;
        elements.green.textContent = green;
        elements.blue.textContent = blue;

        elements.hex.textContent = hexColor;
        elements.preview.style.backgroundColor = hexColor;

        elements.binaryRed.textContent =
            `R: ${convertToBinary(red)}`;

        elements.binaryGreen.textContent =
            `G: ${convertToBinary(green)}`;

        elements.binaryBlue.textContent =
            `B: ${convertToBinary(blue)}`;
    }

    function convertToHex(red, green, blue) {
        return `#${[red, green, blue]
            .map((value) => {
                return value
                    .toString(16)
                    .padStart(2, "0");
            })
            .join("")
            .toUpperCase()}`;
    }

    function convertToBinary(value) {
        return value
            .toString(2)
            .padStart(8, "0");
    }

    function showCursor(x, y) {
        elements.cursor.style.display = "block";
        elements.cursor.style.left = `${x}px`;
        elements.cursor.style.top = `${y}px`;
    }

    function hideCursor() {
        elements.cursor.style.display = "none";
    }
});