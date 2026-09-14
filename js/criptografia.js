// ========================================
// PIXELCIPHER LAB — CRIPTOGRAFIA AES-GCM
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".crypto-tab");

    const encryptPanel = document.querySelector("#encrypt-panel");
    const decryptPanel = document.querySelector("#decrypt-panel");

    const encryptMessage = document.querySelector("#encrypt-message");
    const encryptPassword = document.querySelector("#encrypt-password");
    const encryptedOutput = document.querySelector("#encrypted-output");

    const decryptMessage = document.querySelector("#decrypt-message");
    const decryptPassword = document.querySelector("#decrypt-password");
    const decryptedOutput = document.querySelector("#decrypted-output");

    const encryptButton = document.querySelector("#encrypt-button");
    const decryptButton = document.querySelector("#decrypt-button");

    const copyEncryptedButton = document.querySelector(
        "#copy-encrypted-button"
    );

    const copyDecryptedButton = document.querySelector(
        "#copy-decrypted-button"
    );

    const clearEncryptButton = document.querySelector(
        "#clear-encrypt-button"
    );

    const clearDecryptButton = document.querySelector(
        "#clear-decrypt-button"
    );

    const encryptCounter = document.querySelector("#encrypt-counter");
    const strengthProgress = document.querySelector("#strength-progress");
    const strengthText = document.querySelector("#strength-text");
    const status = document.querySelector("#crypto-status");

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const PBKDF2_ITERATIONS = 250000;

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            selectTab(tab.dataset.tab);
        });
    });

    document.querySelectorAll(".show-password").forEach((button) => {
        button.addEventListener("click", () => {
            togglePassword(button);
        });
    });

    encryptMessage.addEventListener("input", () => {
        encryptCounter.textContent = encryptMessage.value.length;
    });

    encryptPassword.addEventListener("input", () => {
        updatePasswordStrength(encryptPassword.value);
    });

    encryptButton.addEventListener("click", encrypt);
    decryptButton.addEventListener("click", decrypt);

    copyEncryptedButton.addEventListener("click", () => {
        copyText(
            encryptedOutput.value,
            "Conteúdo criptografado copiado."
        );
    });

    copyDecryptedButton.addEventListener("click", () => {
        copyText(
            decryptedOutput.value,
            "Mensagem recuperada copiada."
        );
    });

    clearEncryptButton.addEventListener("click", clearEncryption);
    clearDecryptButton.addEventListener("click", clearDecryption);

    function selectTab(selectedTab) {
        tabs.forEach((tab) => {
            tab.classList.toggle(
                "active",
                tab.dataset.tab === selectedTab
            );
        });

        encryptPanel.classList.toggle(
            "hidden",
            selectedTab !== "encrypt"
        );

        decryptPanel.classList.toggle(
            "hidden",
            selectedTab !== "decrypt"
        );

        hideStatus();
    }

    async function encrypt() {
        const message = encryptMessage.value;
        const password = encryptPassword.value;

        hideStatus();

        if (!message.trim()) {
            showStatus("Digite uma mensagem para criptografar.", true);
            return;
        }

        if (password.length < 8) {
            showStatus(
                "Utilize uma senha com pelo menos 8 caracteres.",
                true
            );

            return;
        }

        setButtonLoading(
            encryptButton,
            true,
            "Criptografando..."
        );

        try {
            const salt = crypto.getRandomValues(
                new Uint8Array(16)
            );

            const initializationVector = crypto.getRandomValues(
                new Uint8Array(12)
            );

            const key = await deriveKey(password, salt);

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

            encryptedOutput.value = bytesToBase64(
                encoder.encode(JSON.stringify(packageData))
            );

            copyEncryptedButton.disabled = false;

            showStatus(
                "Mensagem criptografada com sucesso."
            );
        } catch (error) {
            console.error(error);

            showStatus(
                "Não foi possível criptografar a mensagem.",
                true
            );
        } finally {
            setButtonLoading(
                encryptButton,
                false,
                "Criptografar mensagem"
            );
        }
    }

    async function decrypt() {
        const encryptedContent = decryptMessage.value.trim();
        const password = decryptPassword.value;

        hideStatus();

        if (!encryptedContent) {
            showStatus(
                "Cole o conteúdo criptografado.",
                true
            );

            return;
        }

        if (!password) {
            showStatus("Digite a senha utilizada.", true);
            return;
        }

        setButtonLoading(
            decryptButton,
            true,
            "Descriptografando..."
        );

        try {
            const packageText = decoder.decode(
                base64ToBytes(encryptedContent)
            );

            const packageData = JSON.parse(packageText);

            validatePackage(packageData);

            const salt = base64ToBytes(packageData.salt);
            const initializationVector = base64ToBytes(
                packageData.iv
            );

            const encryptedBytes = base64ToBytes(
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
                encryptedBytes
            );

            decryptedOutput.value = decoder.decode(decryptedData);
            copyDecryptedButton.disabled = false;

            showStatus(
                "Mensagem recuperada com sucesso."
            );
        } catch (error) {
            console.error(error);

            decryptedOutput.value = "";
            copyDecryptedButton.disabled = true;

            showStatus(
                "Não foi possível recuperar a mensagem. Verifique a senha e os dados.",
                true
            );
        } finally {
            setButtonLoading(
                decryptButton,
                false,
                "Descriptografar"
            );
        }
    }

    async function deriveKey(
        password,
        salt,
        iterations = PBKDF2_ITERATIONS
    ) {
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

    function validatePackage(packageData) {
        if (
            packageData.version !== 1 ||
            packageData.algorithm !== "AES-GCM" ||
            !packageData.salt ||
            !packageData.iv ||
            !packageData.data ||
            !packageData.iterations
        ) {
            throw new Error("Pacote criptográfico inválido.");
        }
    }

    function bytesToBase64(bytes) {
        let binary = "";

        for (let index = 0; index < bytes.length; index += 1) {
            binary += String.fromCharCode(bytes[index]);
        }

        return btoa(binary);
    }

    function base64ToBytes(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);

        for (let index = 0; index < binary.length; index += 1) {
            bytes[index] = binary.charCodeAt(index);
        }

        return bytes;
    }

    async function copyText(text, message) {
        if (!text) {
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            showStatus(message);
        } catch (error) {
            const temporaryTextarea = document.createElement(
                "textarea"
            );

            temporaryTextarea.value = text;
            document.body.appendChild(temporaryTextarea);
            temporaryTextarea.select();
            document.execCommand("copy");
            temporaryTextarea.remove();

            showStatus(message);
        }
    }

    function togglePassword(button) {
        const input = document.querySelector(
            `#${button.dataset.target}`
        );

        if (!input) {
            return;
        }

        const passwordVisible = input.type === "text";

        input.type = passwordVisible ? "password" : "text";
        button.textContent = passwordVisible ? "Mostrar" : "Ocultar";
    }

    function updatePasswordStrength(password) {
        let score = 0;

        if (password.length >= 8) {
            score += 1;
        }

        if (password.length >= 12) {
            score += 1;
        }

        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
            score += 1;
        }

        if (/\d/.test(password)) {
            score += 1;
        }

        if (/[^a-zA-Z0-9]/.test(password)) {
            score += 1;
        }

        const levels = [
            {
                width: "0%",
                text: "Informe uma senha",
                color: "#ff4057"
            },
            {
                width: "20%",
                text: "Senha muito fraca",
                color: "#ff4057"
            },
            {
                width: "40%",
                text: "Senha fraca",
                color: "#ff8a3d"
            },
            {
                width: "60%",
                text: "Senha razoável",
                color: "#ffc94a"
            },
            {
                width: "80%",
                text: "Senha forte",
                color: "#75ffad"
            },
            {
                width: "100%",
                text: "Senha muito forte",
                color: "#00ff66"
            }
        ];

        const level = password.length === 0
            ? levels[0]
            : levels[score];

        strengthProgress.style.width = level.width;
        strengthProgress.style.backgroundColor = level.color;

        strengthText.textContent = level.text;
        strengthText.style.color = level.color;
    }

    function clearEncryption() {
        encryptMessage.value = "";
        encryptPassword.value = "";
        encryptedOutput.value = "";

        encryptCounter.textContent = "0";
        copyEncryptedButton.disabled = true;

        updatePasswordStrength("");
        hideStatus();
    }

    function clearDecryption() {
        decryptMessage.value = "";
        decryptPassword.value = "";
        decryptedOutput.value = "";

        copyDecryptedButton.disabled = true;
        hideStatus();
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