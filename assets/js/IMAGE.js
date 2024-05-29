// Define the key matrix and modulus
const keyMatrix = [
    [3, 3],
    [2, 5]
];
const mod = 256; // Use 256 for RGB values

// Function to find the modular multiplicative inverse of a number (for decryption)
function modInverse(a, m) {
    a = a % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return 1; // In case there's no modular inverse
}

// Function to find the inverse of a 2x2 matrix (for decryption)
function matrixInverse(matrix, modulus) {
    const det = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % modulus;
    const detInv = modInverse(det, modulus);

    const adjugateMatrix = [
        [matrix[1][1], -matrix[0][1]],
        [-matrix[1][0], matrix[0][0]]
    ];

    const inverseMatrix = adjugateMatrix.map(row => row.map(val => ((val * detInv) % modulus + modulus) % modulus));
    return inverseMatrix;
}

// Function to multiply a matrix by a vector and apply modulus
function matrixMultiply(matrixA, matrixB, modulus) {
    const result = [
        (matrixA[0][0] * matrixB[0] + matrixA[0][1] * matrixB[1]) % modulus,
        (matrixA[1][0] * matrixB[0] + matrixA[1][1] * matrixB[1]) % modulus
    ];
    return result;
}

// Function to encrypt image using Hill Cipher
function encryptDataHillCipher() {
    const fileInput = document.getElementById('takeImage');
    const canvas = document.getElementById('canvasOutput');
    const ctx = canvas.getContext('2d');

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    const pixel = [
                        data[i],
                        data[i + 1]
                    ];

                    const encryptedPixel = matrixMultiply(keyMatrix, pixel, mod);

                    data[i] = encryptedPixel[0];
                    data[i + 1] = encryptedPixel[1];
                }

                ctx.putImageData(imageData, 0, 0);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        alert("Please select an image file first.");
    }
}

// Function to decrypt image using Hill Cipher
function decryptData() {
    const fileInput = document.getElementById('takeDecryptImage');
    const canvas = document.getElementById('canvasOutputDecrypt');
    const ctx = canvas.getContext('2d');

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const data = imageData.data;

                const inverseKeyMatrix = matrixInverse(keyMatrix, mod);

                for (let i = 0; i < data.length; i += 4) {
                    const pixel = [
                        data[i],
                        data[i + 1]
                    ];

                    const decryptedPixel = matrixMultiply(inverseKeyMatrix, pixel, mod);

                    data[i] = decryptedPixel[0];
                    data[i + 1] = decryptedPixel[1];
                }

                ctx.putImageData(imageData, 0, 0);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        alert("Please select an image file first.");
    }
}

// Function to clear input fields and canvases for encryption
function clearInput() {
    const fileInput = document.getElementById('takeImage');
    const canvas = document.getElementById('canvasOutput');
    const ctx = canvas.getContext('2d');
    fileInput.value = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to clear input fields and canvases for decryption
function clearDecryptInput() {
    const fileInput = document.getElementById('takeDecryptImage');
    const canvas = document.getElementById('canvasOutputDecrypt');
    const ctx = canvas.getContext('2d');
    fileInput.value = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
