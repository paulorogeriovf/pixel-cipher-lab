// ========================================
// PIXELCIPHER LAB — ESTEGANOGRAFIA LSB
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const MAGIC_HEADER = "PCL1";
    const HEADER_SIZE = 8;
    const MAX_FILE_SIZE = 15 * 1024 * 1024;

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const tabs = document.querySelectorAll(".stego-tab");
    const hidePanel = document.querySelector("#hide-panel");
    const revealPanel = document.querySelector("#reveal-panel");

    const hideImageInput = document.querySelector("#hide-image-input");
    const hideImageButton = document.querySelector("#hide-image-button");
    const hidePreviewContainer = document.querySelector(
        "#hide-preview-container"
    );

    const hideCanvas = document.querySelector("#hide-canvas");
    const hideContext = hideCanvas.getContext("2d", {
        willReadFrequently: true
    });

    const resultCanvas = document.querySelector(
        "#result-stego-canvas"
    );

    const resultContext = resultCanvas.getContext("2d", {
        willReadFrequently: true
    });

    const secretMessage = document.querySelector("#secret-message");
    const usedCapacity = document.querySelector("#used-capacity");
    const totalCapacity = document.querySelector("#total-capacity");
    const capacityProgress = document.querySelector(
        "#capacity-progress"
    );

    const hideMessageButton = document.querySelector(
        "#hide-message-button"
    );

    const downloadButton = document.querySelector(
        "#download-stego-button"
    );

    const hideEmptyResult = document.querySelector(
        "#hide-empty-result"
    );

    const encodedResult = document.querySelector("#encoded-result");
    const changedChannels = document.querySelector("#changed-channels");

    const hideFileName = document.querySelector("#hide-file-name");
    const hideResolution = document.querySelector("#hide-resolution");

    const revealImageInput = document.querySelector(
        "#reveal-image-input"
    );

    const revealImageButton = document.querySelector(
        "#reveal-image-button"
    );

    const revealCanvas = document.querySelector("#reveal-canvas");
    const revealContext = revealCanvas.getContext("2d", {
        willReadFrequently: true
    });

    const revealPreviewContainer = document.querySelector(
        "#reveal-preview-container"
    );

    const revealFileName = document.querySelector(
        "#reveal-file-name"
    );

    const revealResolution = document.querySelector(
        "#reveal-resolution"
    );

    const revealMessageButton = document.querySelector(
        "#reveal-message-button"
    );

    const revealedMessage = document.querySelector(
        "#revealed-message"
    );

    const copyRevealedButton = document.querySelector(
        "#copy-revealed-button"
    );

    const status = document.querySelector("#stego-status");

    let hideImageData = null;
    let resultAvailable = false;
    let originalFileName = "imagem";

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            selectTab(tab.dataset.tab);
        });
    });

    hideImageButton.addEventListener("click", () => {
        hideImageInput.click();
    });

    revealImageButton.addEventListener("click", () => {
        revealImageInput.click();
    });

    hideImageInput.addEventListener("change", () => {
        const file = hideImageInput.files[0];

        if (file) {
            loadImage(file, "hide");
        }
    });

    revealImageInput.addEventListener("change", () => {
        const file = revealImageInput.files[0];

        if (file) {
            loadImage(file, "reveal");
        }
    });

    secretMessage.addEventListener("input", updateCapacity);
    hideMessageButton.addEventListener("click", hideMessage);
    revealMessageButton.addEventListener("click", revealMessage);
    downloadButton.addEventListener("click", downloadImage);

    copyRevealedButton.addEventListener("click", async () => {
        if (!revealedMessage.value) {
            return;
        }

        try {
            await navigator.clipboard.writeText(
                revealedMessage.value
            );

            showStatus("Mensagem copiada.");
        } catch {
            revealedMessage.select();
            document.execCommand("copy");
            showStatus("Mensagem copiada.");
        }
    });

    function selectTab(selectedTab) {
        tabs.forEach((tab) => {
            tab.classList.toggle(
                "active",
                tab.dataset.tab === selectedTab
            );
        });

        hidePanel.classList.toggle(
            "hidden",
            selectedTab !== "hide"
        );

        revealPanel.classList.toggle(
            "hidden",
            selectedTab !== "reveal"
        );

        hideStatus();
    }

    function loadImage(file, mode) {
        hideStatus();

        if (!file.type.startsWith("image/")) {
            showStatus("Selecione uma imagem válida.", true);
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            showStatus(
                "A imagem deve possuir no máximo 15 MB.",
                true
            );

            return;
        }

        if (mode === "reveal" && file.type !== "image/png") {
            showStatus(
                "Para revelar uma mensagem, utilize a imagem PNG gerada pelo laboratório.",
                true
            );

            return;
        }

        const reader = new FileReader();

        reader.addEventListener("load", () => {
            const image = new Image();

            image.addEventListener("load", () => {
                drawImage(image, file, mode);
            });

            image.addEventListener("error", () => {
                showStatus(
                    "Não foi possível abrir a imagem.",
                    true
                );
            });

            image.src = reader.result;
        });

        reader.readAsDataURL(file);
    }

    function drawImage(image, file, mode) {
        const canvas = mode === "hide"
            ? hideCanvas
            : revealCanvas;

        const context = mode === "hide"
            ? hideContext
            : revealContext;

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);

        if (mode === "hide") {
            hideImageData = context.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

            originalFileName = removeExtension(file.name);

            hideFileName.textContent = file.name;
            hideResolution.textContent =
                `${canvas.width} × ${canvas.height}`;

            hidePreviewContainer.classList.remove("hidden");
            hideMessageButton.disabled = false;

            resultAvailable = false;
            downloadButton.disabled = true;
            encodedResult.classList.add("hidden");
            hideEmptyResult.classList.remove("hidden");

            updateCapacity();
        } else {
            revealFileName.textContent = file.name;
            revealResolution.textContent =
                `${canvas.width} × ${canvas.height}`;

            revealPreviewContainer.classList.remove("hidden");
            revealMessageButton.disabled = false;

            revealedMessage.value = "";
            copyRevealedButton.disabled = true;
        }

        showStatus("Imagem carregada com sucesso.");
    }

    function getMaximumMessageBytes() {
        if (!hideImageData) {
            return 0;
        }

        const availableColorChannels =
            hideImageData.width *
            hideImageData.height *
            3;

        return Math.max(
            0,
            Math.floor(availableColorChannels / 8) -
            HEADER_SIZE
        );
    }

    function updateCapacity() {
        const messageBytes = encoder.encode(
            secretMessage.value
        ).length;

        const maximumBytes = getMaximumMessageBytes();

        usedCapacity.textContent = formatBytes(messageBytes);
        totalCapacity.textContent = formatBytes(maximumBytes);

        const percentage = maximumBytes > 0
            ? Math.min(100, (messageBytes / maximumBytes) * 100)
            : 0;

        capacityProgress.style.width = `${percentage}%`;

        const exceedsCapacity = messageBytes > maximumBytes;

        capacityProgress.classList.toggle(
            "capacity-error",
            exceedsCapacity
        );

        hideMessageButton.disabled =
            !hideImageData ||
            !secretMessage.value ||
            exceedsCapacity;
    }

    function hideMessage() {
        hideStatus();

        if (!hideImageData || !secretMessage.value) {
            showStatus(
                "Selecione uma imagem e digite uma mensagem.",
                true
            );

            return;
        }

        const messageBytes = encoder.encode(secretMessage.value);
        const payload = createPayload(messageBytes);

        const requiredBits = payload.length * 8;
        const availableBits =
            hideImageData.width *
            hideImageData.height *
            3;

        if (requiredBits > availableBits) {
            showStatus(
                "A mensagem é grande demais para esta imagem.",
                true
            );

            return;
        }

        const resultImageData = new ImageData(
            new Uint8ClampedArray(hideImageData.data),
            hideImageData.width,
            hideImageData.height
        );

        const pixels = resultImageData.data;

        let bitIndex = 0;
        let changed = 0;

        for (
            let pixelIndex = 0;
            pixelIndex < pixels.length && bitIndex < requiredBits;
            pixelIndex += 1
        ) {
            // Ignora o canal alfa de cada pixel.
            if ((pixelIndex + 1) % 4 === 0) {
                continue;
            }

            const byteIndex = Math.floor(bitIndex / 8);
            const positionInByte = 7 - (bitIndex % 8);

            const bit =
                (payload[byteIndex] >> positionInByte) & 1;

            const originalValue = pixels[pixelIndex];
            const modifiedValue = (originalValue & 254) | bit;

            if (originalValue !== modifiedValue) {
                changed += 1;
            }

            pixels[pixelIndex] = modifiedValue;
            bitIndex += 1;
        }

        resultCanvas.width = resultImageData.width;
        resultCanvas.height = resultImageData.height;

        resultContext.putImageData(resultImageData, 0, 0);

        changedChannels.textContent =
            `${changed.toLocaleString("pt-BR")} canais alterados`;

        hideEmptyResult.classList.add("hidden");
        encodedResult.classList.remove("hidden");

        resultAvailable = true;
        downloadButton.disabled = false;

        showStatus(
            "Mensagem escondida com sucesso. Baixe a imagem em PNG."
        );
    }

    function revealMessage() {
        hideStatus();

        if (!revealCanvas.width || !revealCanvas.height) {
            showStatus(
                "Selecione uma imagem codificada.",
                true
            );

            return;
        }

        try {
            const imageData = revealContext.getImageData(
                0,
                0,
                revealCanvas.width,
                revealCanvas.height
            );

            const extractedBytes = extractAllBytes(
                imageData.data
            );

            if (extractedBytes.length < HEADER_SIZE) {
                throw new Error("Imagem sem dados suficientes.");
            }

            const headerText = decoder.decode(
                extractedBytes.slice(0, 4)
            );

            if (headerText !== MAGIC_HEADER) {
                throw new Error("Assinatura não encontrada.");
            }

            const messageLength = readLength(
                extractedBytes.slice(4, 8)
            );

            const maximumPossibleLength =
                extractedBytes.length - HEADER_SIZE;

            if (
                messageLength <= 0 ||
                messageLength > maximumPossibleLength
            ) {
                throw new Error("Tamanho inválido.");
            }

            const messageBytes = extractedBytes.slice(
                HEADER_SIZE,
                HEADER_SIZE + messageLength
            );

            revealedMessage.value = decoder.decode(messageBytes);
            copyRevealedButton.disabled = false;

            showStatus("Mensagem encontrada e extraída.");
        } catch (error) {
            console.error(error);

            revealedMessage.value = "";
            copyRevealedButton.disabled = true;

            showStatus(
                "Nenhuma mensagem válida do PixelCipher Lab foi encontrada.",
                true
            );
        }
    }

    function createPayload(messageBytes) {
        const headerBytes = encoder.encode(MAGIC_HEADER);
        const lengthBytes = new Uint8Array(4);

        const dataView = new DataView(lengthBytes.buffer);
        dataView.setUint32(0, messageBytes.length, false);

        const payload = new Uint8Array(
            HEADER_SIZE + messageBytes.length
        );

        payload.set(headerBytes, 0);
        payload.set(lengthBytes, 4);
        payload.set(messageBytes, HEADER_SIZE);

        return payload;
    }

    function extractAllBytes(pixelData) {
        const bits = [];

        for (let index = 0; index < pixelData.length; index += 1) {
            if ((index + 1) % 4 === 0) {
                continue;
            }

            bits.push(pixelData[index] & 1);
        }

        const byteLength = Math.floor(bits.length / 8);
        const bytes = new Uint8Array(byteLength);

        for (let byteIndex = 0; byteIndex < byteLength; byteIndex += 1) {
            let value = 0;

            for (let bitIndex = 0; bitIndex < 8; bitIndex += 1) {
                value =
                    (value << 1) |
                    bits[byteIndex * 8 + bitIndex];
            }

            bytes[byteIndex] = value;
        }

        return bytes;
    }

    function readLength(bytes) {
        const dataView = new DataView(
            bytes.buffer,
            bytes.byteOffset,
            bytes.byteLength
        );

        return dataView.getUint32(0, false);
    }

    function downloadImage() {
        if (!resultAvailable) {
            return;
        }

        resultCanvas.toBlob((blob) => {
            if (!blob) {
                showStatus(
                    "Não foi possível gerar o arquivo.",
                    true
                );

                return;
            }

            const link = document.createElement("a");
            const objectUrl = URL.createObjectURL(blob);

            link.href = objectUrl;
            link.download =
                `${originalFileName}-com-mensagem.png`;

            link.click();

            setTimeout(() => {
                URL.revokeObjectURL(objectUrl);
            }, 1000);

            showStatus("Imagem PNG baixada.");
        }, "image/png");
    }

    function formatBytes(bytes) {
        if (bytes < 1024) {
            return `${bytes} bytes`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function removeExtension(fileName) {
        return fileName.replace(/\.[^/.]+$/, "");
    }

    function showStatus(message, isError = false) {
        status.textContent = `> ${message}`;

        status.classList.remove("hidden");
        status.classList.toggle("error", isError);
    }

    function hideStatus() {
        status.textContent = "";
        status.classList.add("hidden");
        status.classList.remove("error");
    }
});