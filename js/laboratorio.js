// ===================================================
// PIXELCIPHER LAB — CRIPTOGRAFIA + ESTEGANOGRAFIA
// ===================================================

document.addEventListener("DOMContentLoaded", () => {
    const MAGIC_HEADER = "PCL2";
    const HEADER_SIZE = 8;
    const PBKDF2_ITERATIONS = 250000;
    const MAX_FILE_SIZE = 15 * 1024 * 1024;

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const tabs = document.querySelectorAll(".laboratory-tab");
    const protectPanel = document.querySelector("#protect-panel");
    const recoverPanel = document.querySelector("#recover-panel");

    const protectImageInput = document.querySelector(
        "#protect-image-input"
    );

    const protectImageButton = document.querySelector(
        "#protect-image-button"
    );

    const protectCanvas = document.querySelector("#protect-canvas");

    const protectContext = protectCanvas.getContext("2d", {
        willReadFrequently: true
    });

    const protectImagePreview = document.querySelector(
        "#protect-image-preview"
    );

    const protectFileName = document.querySelector(
        "#protect-file-name"
    );

    const protectResolution = document.querySelector(
        "#protect-resolution"
    );

    const protectCapacity = document.querySelector(
        "#protect-capacity"
    );

    const protectMessage = document.querySelector(
        "#protect-message"
    );

    const protectCharacterCount = document.querySelector(
        "#protect-character-count"
    );

    const messageSize = document.querySelector("#message-size");

    const protectPassword = document.querySelector(
        "#protect-password"
    );

    const confirmPassword = document.querySelector(
        "#confirm-password"
    );

    const passwordProgress = document.querySelector(
        "#password-progress"
    );

    const passwordStrengthText = document.querySelector(
        "#password-strength-text"
    );

    const protectButton = document.querySelector("#protect-button");

    const processProgress = document.querySelector(
        "#process-progress"
    );

    const progressPercentage = document.querySelector(
        "#progress-percentage"
    );

    const progressBarValue = document.querySelector(
        "#progress-bar-value"
    );

    const protectionResult = document.querySelector(
        "#protection-result"
    );

    const protectedResultCanvas = document.querySelector(
        "#protected-result-canvas"
    );

    const protectedResultContext =
        protectedResultCanvas.getContext("2d");

    const resultChangedChannels = document.querySelector(
        "#result-changed-channels"
    );

    const downloadProtectedButton = document.querySelector(
        "#download-protected-button"
    );

    const restartProtectionButton = document.querySelector(
        "#restart-protection-button"
    );

    const recoverImageInput = document.querySelector(
        "#recover-image-input"
    );

    const recoverImageButton = document.querySelector(
        "#recover-image-button"
    );

    const recoverCanvas = document.querySelector("#recover-canvas");

    const recoverContext = recoverCanvas.getContext("2d", {
        willReadFrequently: true
    });

    const recoverImagePreview = document.querySelector(
        "#recover-image-preview"
    );

    const recoverFileName = document.querySelector(
        "#recover-file-name"
    );

    const recoverResolution = document.querySelector(
        "#recover-resolution"
    );

    const recoverPassword = document.querySelector(
        "#recover-password"
    );

    const recoverButton = document.querySelector("#recover-button");

    const recoveredResult = document.querySelector(
        "#recovered-result"
    );

    const recoveredMessage = document.querySelector(
        "#recovered-message"
    );

    const copyRecoveredButton = document.querySelector(
        "#copy-recovered-button"
    );

    const restartRecoveryButton = document.querySelector(
        "#restart-recovery-button"
    );

    const status = document.querySelector("#laboratory-status");

    let originalImageData = null;
    let protectedImageAvailable = false;
    let originalFileName = "imagem";

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            selectMode(tab.dataset.mode);
        });
    });

    document
        .querySelectorAll(".show-password-button")
        .forEach((button) => {
            button.addEventListener("click", () => {
                togglePassword(button);
            });
        });

    protectImageButton.addEventListener("click", () => {
        protectImageInput.click();
    });

    recoverImageButton.addEventListener("click", () => {
        recoverImageInput.click();
    });

    protectImageInput.addEventListener("change", () => {
        const file = protectImageInput.files[0];

        if (file) {
            loadImage(file, "protect");
        }
    });

    recoverImageInput.addEventListener("change", () => {
        const file = recoverImageInput.files[0];

        if (file) {
            loadImage(file, "recover");
        }
    });

    protectMessage.addEventListener("input", () => {
        const bytes = encoder.encode(protectMessage.value).length;

        protectCharacterCount.textContent =
            protectMessage.value.length;

        messageSize.textContent = formatBytes(bytes);
    });

    protectPassword.addEventListener("input", () => {
        updatePasswordStrength(protectPassword.value);
    });

    protectButton.addEventListener("click", protectAndHide);
    recoverButton.addEventListener("click", extractAndDecrypt);
    downloadProtectedButton.addEventListener("click", downloadImage);

    restartProtectionButton.addEventListener("click", () => {
        protectionResult.classList.add("hidden");
        processProgress.classList.add("hidden");
        protectedImageAvailable = false;
        hideStatus();

        window.scrollTo({
            top: protectPanel.offsetTop - 100,
            behavior: "smooth"
        });
    });

    restartRecoveryButton.addEventListener("click", () => {
        recoverImageInput.value = "";
        recoverPassword.value = "";
        recoveredMessage.value = "";

        recoverImagePreview.classList.add("hidden");
        recoveredResult.classList.add("hidden");

        hideStatus();
    });

    copyRecoveredButton.addEventListener("click", async () => {
        if (!recoveredMessage.value) {
            return;
        }

        try {
            await navigator.clipboard.writeText(
                recoveredMessage.value
            );

            showStatus("Mensagem copiada.");
        } catch {
            recoveredMessage.select();
            document.execCommand("copy");
            showStatus("Mensagem copiada.");
        }
    });

    function selectMode(mode) {
        tabs.forEach((tab) => {
            tab.classList.toggle(
                "active",
                tab.dataset.mode === mode
            );
        });

        protectPanel.classList.toggle(
            "hidden",
            mode !== "protect"
        );

        recoverPanel.classList.toggle(
            "hidden",
            mode !== "recover"
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

        if (mode === "recover" && file.type !== "image/png") {
            showStatus(
                "A recuperação exige a imagem PNG gerada pelo laboratório.",
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
        const canvas = mode === "protect"
            ? protectCanvas
            : recoverCanvas;

        const context = mode === "protect"
            ? protectContext
            : recoverContext;

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);

        if (mode === "protect") {
            originalImageData = context.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

            originalFileName = removeExtension(file.name);

            protectFileName.textContent = file.name;
            protectResolution.textContent =
                `${canvas.width} × ${canvas.height}`;

            protectCapacity.textContent = formatBytes(
                calculateCapacity(canvas.width, canvas.height)
            );

            protectImagePreview.classList.remove("hidden");
            protectionResult.classList.add("hidden");

            protectedImageAvailable = false;
        } else {
            recoverFileName.textContent = file.name;
            recoverResolution.textContent =
                `${canvas.width} × ${canvas.height}`;

            recoverImagePreview.classList.remove("hidden");
            recoveredResult.classList.add("hidden");
        }

        showStatus("Imagem carregada com sucesso.");
    }

    async function protectAndHide() {
        hideStatus();

        const message = protectMessage.value;
        const password = protectPassword.value;
        const confirmation = confirmPassword.value;

        if (!originalImageData) {
            showStatus("Selecione uma imagem.", true);
            return;
        }

        if (!message.trim()) {
            showStatus("Digite uma mensagem.", true);
            return;
        }

        if (password.length < 8) {
            showStatus(
                "A senha deve possuir pelo menos 8 caracteres.",
                true
            );

            return;
        }

        if (password !== confirmation) {
            showStatus("As senhas não são iguais.", true);
            return;
        }

        setButtonLoading(
            protectButton,
            true,
            "Executando proteção..."
        );

        resetProgress();
        processProgress.classList.remove("hidden");

        try {
            updateProgress(20, "step-validate");
            await waitForScreen();

            const encryptedPackage = await encryptMessage(
                message,
                password
            );

            updateProgress(50, "step-encrypt");
            await waitForScreen();

            const encryptedBytes = encoder.encode(
                encryptedPackage
            );

            const payload = createPayload(encryptedBytes);

            const availableBits =
                originalImageData.width *
                originalImageData.height *
                3;

            if (payload.length * 8 > availableBits) {
                throw new Error(
                    "A imagem não possui capacidade suficiente para esta mensagem."
                );
            }

            const result = insertPayload(
                originalImageData,
                payload
            );

            updateProgress(80, "step-hide");
            await waitForScreen();

            protectedResultCanvas.width =
                result.imageData.width;

            protectedResultCanvas.height =
                result.imageData.height;

            protectedResultContext.putImageData(
                result.imageData,
                0,
                0
            );

            resultChangedChannels.textContent =
                result.changed.toLocaleString("pt-BR");

            updateProgress(100, "step-complete");

            protectedImageAvailable = true;
            protectionResult.classList.remove("hidden");

            showStatus(
                "Mensagem criptografada e escondida com sucesso."
            );

            protectionResult.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        } catch (error) {
            console.error(error);

            showStatus(
                error.message ||
                "Não foi possível concluir a proteção.",
                true
            );
        } finally {
            setButtonLoading(
                protectButton,
                false,
                "Executar proteção completa"
            );
        }
    }

    async function extractAndDecrypt() {
        hideStatus();

        const password = recoverPassword.value;

        if (!recoverCanvas.width || !recoverCanvas.height) {
            showStatus(
                "Selecione uma imagem protegida.",
                true
            );

            return;
        }

        if (!password) {
            showStatus("Digite a senha utilizada.", true);
            return;
        }

        setButtonLoading(
            recoverButton,
            true,
            "Extraindo dados..."
        );

        try {
            const imageData = recoverContext.getImageData(
                0,
                0,
                recoverCanvas.width,
                recoverCanvas.height
            );

            const headerBytes = extractBytes(
                imageData.data,
                HEADER_SIZE
            );

            const headerText = decoder.decode(
                headerBytes.slice(0, 4)
            );

            if (headerText !== MAGIC_HEADER) {
                throw new Error(
                    "Esta imagem não contém uma mensagem protegida pelo laboratório."
                );
            }

            const payloadLength = readLength(
                headerBytes.slice(4, 8)
            );

            const capacity = calculateCapacity(
                recoverCanvas.width,
                recoverCanvas.height
            );

            if (
                payloadLength <= 0 ||
                payloadLength > capacity
            ) {
                throw new Error(
                    "Os dados escondidos parecem estar corrompidos."
                );
            }

            const completePayload = extractBytes(
                imageData.data,
                HEADER_SIZE + payloadLength
            );

            const encryptedBytes = completePayload.slice(
                HEADER_SIZE
            );

            const encryptedPackage = decoder.decode(
                encryptedBytes
            );

            const message = await decryptMessage(
                encryptedPackage,
                password
            );

            recoveredMessage.value = message;
            recoveredResult.classList.remove("hidden");

            showStatus(
                "Mensagem extraída e descriptografada com sucesso."
            );

            recoveredResult.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        } catch (error) {
            console.error(error);

            recoveredMessage.value = "";
            recoveredResult.classList.add("hidden");

            showStatus(
                "Não foi possível recuperar a mensagem. Verifique a senha e utilize o PNG original.",
                true
            );
        } finally {
            setButtonLoading(
                recoverButton,
                false,
                "Extrair e descriptografar"
            );
        }
    }

    async function encryptMessage(message, password) {
        const salt = crypto.getRandomValues(
            new Uint8Array(16)
        );

        const initializationVector = crypto.getRandomValues(
            new Uint8Array(12)
        );

        const key = await deriveKey(
            password,
            salt,
            PBKDF2_ITERATIONS
        );

        const encryptedData = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: initializationVector
            },
            key,
            encoder.encode(message)
        );

        const packageData = {
            version: 1,
            algorithm: "AES-GCM",
            iterations: PBKDF2_ITERATIONS,
            salt: bytesToBase64(salt),
            iv: bytesToBase64(initializationVector),
            data: bytesToBase64(
                new Uint8Array(encryptedData)
            )
        };

        return JSON.stringify(packageData);
    }

    async function decryptMessage(packageText, password) {
        const packageData = JSON.parse(packageText);

        if (
            packageData.version !== 1 ||
            packageData.algorithm !== "AES-GCM" ||
            !packageData.salt ||
            !packageData.iv ||
            !packageData.data
        ) {
            throw new Error("Pacote criptográfico inválido.");
        }

        const salt = base64ToBytes(packageData.salt);
        const initializationVector = base64ToBytes(
            packageData.iv
        );

        const encryptedData = base64ToBytes(
            packageData.data
        );

        const key = await deriveKey(
            password,
            salt,
            packageData.iterations
        );

        const decryptedData = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: initializationVector
            },
            key,
            encryptedData
        );

        return decoder.decode(decryptedData);
    }

    async function deriveKey(password, salt, iterations) {
        const baseKey = await crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            "PBKDF2",
            false,
            ["deriveKey"]
        );

        return crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt,
                iterations,
                hash: "SHA-256"
            },
            baseKey,
            {
                name: "AES-GCM",
                length: 256
            },
            false,
            ["encrypt", "decrypt"]
        );
    }

    function createPayload(encryptedBytes) {
        const header = encoder.encode(MAGIC_HEADER);
        const lengthBytes = new Uint8Array(4);

        new DataView(lengthBytes.buffer).setUint32(
            0,
            encryptedBytes.length,
            false
        );

        const payload = new Uint8Array(
            HEADER_SIZE + encryptedBytes.length
        );

        payload.set(header, 0);
        payload.set(lengthBytes, 4);
        payload.set(encryptedBytes, HEADER_SIZE);

        return payload;
    }

    function insertPayload(sourceImageData, payload) {
        const resultImageData = new ImageData(
            new Uint8ClampedArray(sourceImageData.data),
            sourceImageData.width,
            sourceImageData.height
        );

        const pixels = resultImageData.data;
        const requiredBits = payload.length * 8;

        let bitIndex = 0;
        let changed = 0;

        for (
            let pixelIndex = 0;
            pixelIndex < pixels.length &&
            bitIndex < requiredBits;
            pixelIndex += 1
        ) {
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

        return {
            imageData: resultImageData,
            changed
        };
    }

    function extractBytes(pixelData, byteCount) {
        const result = new Uint8Array(byteCount);

        let byteIndex = 0;
        let currentByte = 0;
        let bitsInCurrentByte = 0;

        for (
            let pixelIndex = 0;
            pixelIndex < pixelData.length &&
            byteIndex < byteCount;
            pixelIndex += 1
        ) {
            if ((pixelIndex + 1) % 4 === 0) {
                continue;
            }

            currentByte =
                (currentByte << 1) |
                (pixelData[pixelIndex] & 1);

            bitsInCurrentByte += 1;

            if (bitsInCurrentByte === 8) {
                result[byteIndex] = currentByte;

                byteIndex += 1;
                currentByte = 0;
                bitsInCurrentByte = 0;
            }
        }

        if (byteIndex < byteCount) {
            throw new Error("Dados incompletos na imagem.");
        }

        return result;
    }

    function readLength(lengthBytes) {
        return new DataView(
            lengthBytes.buffer,
            lengthBytes.byteOffset,
            lengthBytes.byteLength
        ).getUint32(0, false);
    }

    function calculateCapacity(width, height) {
        return Math.max(
            0,
            Math.floor((width * height * 3) / 8) -
            HEADER_SIZE
        );
    }

    function downloadImage() {
        if (!protectedImageAvailable) {
            return;
        }

        protectedResultCanvas.toBlob((blob) => {
            if (!blob) {
                showStatus(
                    "Não foi possível gerar a imagem.",
                    true
                );

                return;
            }

            const link = document.createElement("a");
            const objectUrl = URL.createObjectURL(blob);

            link.href = objectUrl;
            link.download =
                `${originalFileName}-protegida.png`;

            link.click();

            setTimeout(() => {
                URL.revokeObjectURL(objectUrl);
            }, 1000);

            showStatus("Imagem protegida baixada em PNG.");
        }, "image/png");
    }

    function bytesToBase64(bytes) {
        let binary = "";

        for (const byte of bytes) {
            binary += String.fromCharCode(byte);
        }

        return btoa(binary);
    }

    function base64ToBytes(base64) {
        const binary = atob(base64);
        const result = new Uint8Array(binary.length);

        for (let index = 0; index < binary.length; index += 1) {
            result[index] = binary.charCodeAt(index);
        }

        return result;
    }

    function togglePassword(button) {
        const input = document.querySelector(
            `#${button.dataset.target}`
        );

        const visible = input.type === "text";

        input.type = visible ? "password" : "text";
        button.textContent = visible ? "Mostrar" : "Ocultar";
    }

    function updatePasswordStrength(password) {
        let score = 0;

        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
            score += 1;
        }
        if (/\d/.test(password)) score += 1;
        if (/[^a-zA-Z0-9]/.test(password)) score += 1;

        const levels = [
            ["0%", "Informe uma senha", "#ff4057"],
            ["20%", "Senha muito fraca", "#ff4057"],
            ["40%", "Senha fraca", "#ff8a3d"],
            ["60%", "Senha razoável", "#ffc94a"],
            ["80%", "Senha forte", "#75ffad"],
            ["100%", "Senha muito forte", "#00ff66"]
        ];

        const level = password.length === 0
            ? levels[0]
            : levels[score];

        passwordProgress.style.width = level[0];
        passwordProgress.style.backgroundColor = level[2];

        passwordStrengthText.textContent = level[1];
        passwordStrengthText.style.color = level[2];
    }

    function resetProgress() {
        progressBarValue.style.width = "0%";
        progressPercentage.textContent = "0%";

        document
            .querySelectorAll(".progress-steps span")
            .forEach((step) => {
                step.classList.remove("complete");
            });
    }

    function updateProgress(percentage, completedStepId) {
        progressBarValue.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}%`;

        const step = document.querySelector(
            `#${completedStepId}`
        );

        if (step) {
            step.classList.add("complete");
        }
    }

    function waitForScreen() {
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                setTimeout(resolve, 80);
            });
        });
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

    function setButtonLoading(button, loading, text) {
        button.disabled = loading;

        button.innerHTML = loading
            ? text
            : `${text} <span>→</span>`;
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