// =====================================
// PIXELCIPHER LAB — FILTROS DE IMAGEM
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.querySelector("#image-input");
    const selectImageButton = document.querySelector(
        "#select-image-button"
    );

    const changeImageButton = document.querySelector(
        "#change-image-button"
    );

    const uploadArea = document.querySelector("#upload-area");
    const workspace = document.querySelector("#filter-workspace");
    const errorMessage = document.querySelector("#error-message");

    const originalCanvas = document.querySelector("#original-canvas");
    const resultCanvas = document.querySelector("#result-canvas");

    if (!imageInput || !originalCanvas || !resultCanvas) {
        return;
    }

    const originalContext = originalCanvas.getContext("2d", {
        willReadFrequently: true
    });

    const resultContext = resultCanvas.getContext("2d", {
        willReadFrequently: true
    });

    const filterButtons = document.querySelectorAll(".filter-button");

    const brightnessRange = document.querySelector(
        "#brightness-range"
    );

    const contrastRange = document.querySelector(
        "#contrast-range"
    );

    const thresholdRange = document.querySelector(
        "#threshold-range"
    );

    const thresholdControl = document.querySelector(
        "#threshold-control"
    );

    const brightnessValue = document.querySelector(
        "#brightness-value"
    );

    const contrastValue = document.querySelector(
        "#contrast-value"
    );

    const thresholdValue = document.querySelector(
        "#threshold-value"
    );

    const resetButton = document.querySelector("#reset-button");
    const downloadButton = document.querySelector("#download-button");

    const fileName = document.querySelector("#file-name");
    const imageResolution = document.querySelector("#image-resolution");
    const currentFilter = document.querySelector("#current-filter");

    const processingStatus = document.querySelector(
        "#processing-status"
    );

    const processingMessage = document.querySelector(
        "#processing-message p"
    );

    const MAX_FILE_SIZE = 15 * 1024 * 1024;
    const MAX_PROCESSING_DIMENSION = 1400;

    let originalImageData = null;
    let selectedFilter = "original";
    let loadedFileName = "imagem";

    const filterNames = {
        original: "Original",
        grayscale: "Escala de cinza",
        threshold: "Preto e branco",
        negative: "Negativo",
        sepia: "Sépia",
        red: "Canal vermelho",
        green: "Canal verde",
        blue: "Canal azul",
        blur: "Desfoque",
        sharpen: "Nitidez",
        edges: "Detecção de bordas"
    };

    selectImageButton.addEventListener("click", (event) => {
        event.stopPropagation();
        imageInput.click();
    });

    changeImageButton.addEventListener("click", () => {
        imageInput.click();
    });

    uploadArea.addEventListener("click", () => {
        imageInput.click();
    });

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];

        if (file) {
            loadImageFile(file);
        }
    });

    uploadArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        uploadArea.classList.add("dragging");
    });

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("dragging");
    });

    uploadArea.addEventListener("drop", (event) => {
        event.preventDefault();
        uploadArea.classList.remove("dragging");

        const file = event.dataTransfer.files[0];

        if (file) {
            loadImageFile(file);
        }
    });

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (!originalImageData) {
                return;
            }

            selectedFilter = button.dataset.filter;

            filterButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            thresholdControl.classList.toggle(
                "hidden",
                selectedFilter !== "threshold"
            );

            applyCurrentFilter();
        });
    });

    brightnessRange.addEventListener("input", () => {
        brightnessValue.textContent = formatSignedValue(
            brightnessRange.value
        );

        applyCurrentFilter();
    });

    contrastRange.addEventListener("input", () => {
        contrastValue.textContent = formatSignedValue(
            contrastRange.value
        );

        applyCurrentFilter();
    });

    thresholdRange.addEventListener("input", () => {
        thresholdValue.textContent = thresholdRange.value;

        if (selectedFilter === "threshold") {
            applyCurrentFilter();
        }
    });

    resetButton.addEventListener("click", resetFilters);
    downloadButton.addEventListener("click", downloadResult);

    function loadImageFile(file) {
        hideError();

        if (!file.type.startsWith("image/")) {
            showError("Selecione um arquivo de imagem válido.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            showError("A imagem deve possuir no máximo 15 MB.");
            return;
        }

        const reader = new FileReader();

        reader.addEventListener("load", () => {
            const image = new Image();

            image.addEventListener("load", () => {
                drawLoadedImage(image, file.name);
            });

            image.addEventListener("error", () => {
                showError("Não foi possível abrir esta imagem.");
            });

            image.src = reader.result;
        });

        reader.addEventListener("error", () => {
            showError("Não foi possível ler o arquivo selecionado.");
        });

        reader.readAsDataURL(file);
    }

    function drawLoadedImage(image, name) {
        const dimensions = calculateDimensions(
            image.naturalWidth,
            image.naturalHeight
        );

        originalCanvas.width = dimensions.width;
        originalCanvas.height = dimensions.height;

        resultCanvas.width = dimensions.width;
        resultCanvas.height = dimensions.height;

        originalContext.clearRect(
            0,
            0,
            dimensions.width,
            dimensions.height
        );

        originalContext.drawImage(
            image,
            0,
            0,
            dimensions.width,
            dimensions.height
        );

        originalImageData = originalContext.getImageData(
            0,
            0,
            dimensions.width,
            dimensions.height
        );

        loadedFileName = removeFileExtension(name);

        fileName.textContent = name;

        imageResolution.textContent =
            `${dimensions.width} × ${dimensions.height}`;

        uploadArea.classList.add("hidden");
        workspace.classList.remove("hidden");

        resetFilters();
    }

    function calculateDimensions(width, height) {
        if (
            width <= MAX_PROCESSING_DIMENSION &&
            height <= MAX_PROCESSING_DIMENSION
        ) {
            return { width, height };
        }

        const scale = Math.min(
            MAX_PROCESSING_DIMENSION / width,
            MAX_PROCESSING_DIMENSION / height
        );

        return {
            width: Math.round(width * scale),
            height: Math.round(height * scale)
        };
    }

    function applyCurrentFilter() {
        if (!originalImageData) {
            return;
        }

        processingStatus.textContent = "processando...";

        requestAnimationFrame(() => {
            let processedImageData;

            if (selectedFilter === "blur") {
                processedImageData = applyConvolution(
                    originalImageData,
                    [
                        1 / 9, 1 / 9, 1 / 9,
                        1 / 9, 1 / 9, 1 / 9,
                        1 / 9, 1 / 9, 1 / 9
                    ]
                );
            } else if (selectedFilter === "sharpen") {
                processedImageData = applyConvolution(
                    originalImageData,
                    [
                        0, -1, 0,
                        -1, 5, -1,
                        0, -1, 0
                    ]
                );
            } else if (selectedFilter === "edges") {
                processedImageData = applyConvolution(
                    originalImageData,
                    [
                        -1, -1, -1,
                        -1, 8, -1,
                        -1, -1, -1
                    ],
                    true
                );
            } else {
                processedImageData = new ImageData(
                    new Uint8ClampedArray(originalImageData.data),
                    originalImageData.width,
                    originalImageData.height
                );

                applyPointFilter(
                    processedImageData,
                    selectedFilter
                );
            }

            applyBrightnessAndContrast(processedImageData);

            resultContext.putImageData(processedImageData, 0, 0);

            currentFilter.textContent =
                filterNames[selectedFilter];

            processingStatus.textContent = "processado";

            processingMessage.textContent =
                createProcessingMessage(selectedFilter);
        });
    }

    function applyPointFilter(imageData, filter) {
        const pixels = imageData.data;
        const threshold = Number(thresholdRange.value);

        for (let index = 0; index < pixels.length; index += 4) {
            const red = pixels[index];
            const green = pixels[index + 1];
            const blue = pixels[index + 2];

            const grayscale =
                (0.299 * red) +
                (0.587 * green) +
                (0.114 * blue);

            switch (filter) {
                case "grayscale":
                    pixels[index] = grayscale;
                    pixels[index + 1] = grayscale;
                    pixels[index + 2] = grayscale;
                    break;

                case "threshold": {
                    const value = grayscale >= threshold ? 255 : 0;

                    pixels[index] = value;
                    pixels[index + 1] = value;
                    pixels[index + 2] = value;
                    break;
                }

                case "negative":
                    pixels[index] = 255 - red;
                    pixels[index + 1] = 255 - green;
                    pixels[index + 2] = 255 - blue;
                    break;

                case "sepia":
                    pixels[index] =
                        (0.393 * red) +
                        (0.769 * green) +
                        (0.189 * blue);

                    pixels[index + 1] =
                        (0.349 * red) +
                        (0.686 * green) +
                        (0.168 * blue);

                    pixels[index + 2] =
                        (0.272 * red) +
                        (0.534 * green) +
                        (0.131 * blue);
                    break;

                case "red":
                    pixels[index + 1] = 0;
                    pixels[index + 2] = 0;
                    break;

                case "green":
                    pixels[index] = 0;
                    pixels[index + 2] = 0;
                    break;

                case "blue":
                    pixels[index] = 0;
                    pixels[index + 1] = 0;
                    break;

                default:
                    break;
            }
        }
    }

    function applyBrightnessAndContrast(imageData) {
        const pixels = imageData.data;

        const brightness = Number(brightnessRange.value);

        const contrastValueNumber = Number(
            contrastRange.value
        );

        const contrastFactor =
            (259 * (contrastValueNumber + 255)) /
            (255 * (259 - contrastValueNumber));

        for (let index = 0; index < pixels.length; index += 4) {
            pixels[index] = limitColor(
                contrastFactor *
                (pixels[index] - 128) +
                128 +
                brightness
            );

            pixels[index + 1] = limitColor(
                contrastFactor *
                (pixels[index + 1] - 128) +
                128 +
                brightness
            );

            pixels[index + 2] = limitColor(
                contrastFactor *
                (pixels[index + 2] - 128) +
                128 +
                brightness
            );
        }
    }

    function applyConvolution(sourceImageData, kernel, grayscaleOutput = false) {
        const width = sourceImageData.width;
        const height = sourceImageData.height;
        const source = sourceImageData.data;

        const output = new ImageData(width, height);
        const target = output.data;

        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                let red = 0;
                let green = 0;
                let blue = 0;

                for (let kernelY = -1; kernelY <= 1; kernelY += 1) {
                    for (
                        let kernelX = -1;
                        kernelX <= 1;
                        kernelX += 1
                    ) {
                        const sampleX = Math.min(
                            width - 1,
                            Math.max(0, x + kernelX)
                        );

                        const sampleY = Math.min(
                            height - 1,
                            Math.max(0, y + kernelY)
                        );

                        const sourceIndex =
                            (sampleY * width + sampleX) * 4;

                        const kernelIndex =
                            (kernelY + 1) * 3 +
                            (kernelX + 1);

                        const weight = kernel[kernelIndex];

                        red += source[sourceIndex] * weight;
                        green += source[sourceIndex + 1] * weight;
                        blue += source[sourceIndex + 2] * weight;
                    }
                }

                const targetIndex = (y * width + x) * 4;

                if (grayscaleOutput) {
                    const intensity = limitColor(
                        Math.abs(red) +
                        Math.abs(green) +
                        Math.abs(blue)
                    );

                    target[targetIndex] = intensity;
                    target[targetIndex + 1] = intensity;
                    target[targetIndex + 2] = intensity;
                } else {
                    target[targetIndex] = limitColor(red);
                    target[targetIndex + 1] = limitColor(green);
                    target[targetIndex + 2] = limitColor(blue);
                }

                target[targetIndex + 3] =
                    source[targetIndex + 3];
            }
        }

        return output;
    }

    function resetFilters() {
        selectedFilter = "original";

        brightnessRange.value = 0;
        contrastRange.value = 0;
        thresholdRange.value = 128;

        brightnessValue.textContent = "0";
        contrastValue.textContent = "0";
        thresholdValue.textContent = "128";

        thresholdControl.classList.add("hidden");

        filterButtons.forEach((button) => {
            button.classList.toggle(
                "active",
                button.dataset.filter === "original"
            );
        });

        applyCurrentFilter();
    }

    function downloadResult() {
        if (!originalImageData) {
            return;
        }

        const link = document.createElement("a");

        const filterFileName = selectedFilter.replace(
            /[^a-z0-9]/gi,
            "-"
        );

        link.download =
            `${loadedFileName}-${filterFileName}.png`;

        link.href = resultCanvas.toDataURL("image/png");
        link.click();

        processingMessage.textContent =
            "Resultado exportado no formato PNG.";
    }

    function formatSignedValue(value) {
        const number = Number(value);

        return number > 0 ? `+${number}` : String(number);
    }

    function limitColor(value) {
        return Math.max(0, Math.min(255, Math.round(value)));
    }

    function removeFileExtension(name) {
        return name.replace(/\.[^/.]+$/, "");
    }

    function createProcessingMessage(filter) {
        const messages = {
            original:
                "A imagem original foi restaurada.",

            grayscale:
                "Os canais RGB foram convertidos em tons de cinza.",

            threshold:
                "Os pixels foram classificados como pretos ou brancos.",

            negative:
                "Cada canal foi invertido utilizando 255 menos seu valor.",

            sepia:
                "Os canais foram combinados para produzir tonalidade sépia.",

            red:
                "Somente as informações do canal vermelho foram preservadas.",

            green:
                "Somente as informações do canal verde foram preservadas.",

            blue:
                "Somente as informações do canal azul foram preservadas.",

            blur:
                "A média entre pixels vizinhos produziu o desfoque.",

            sharpen:
                "O kernel aumentou o contraste entre pixels vizinhos.",

            edges:
                "As variações entre pixels foram utilizadas para destacar bordas."
        };

        return messages[filter];
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove("hidden");
    }

    function hideError() {
        errorMessage.textContent = "";
        errorMessage.classList.add("hidden");
    }
});