function matrixMultiply(matrixA, matrixB, modulus) {
    const result = [
        (matrixA[0][0] * matrixB[0] + matrixA[0][1] * matrixB[1]) % modulus,
        (matrixA[1][0] * matrixB[0] + matrixA[1][1] * matrixB[1]) % modulus
    ];
    return result;
}

function hillEncrypt(plaintext, key, modulus = 26) {
    plaintext = plaintext.replace(/\s+/g, '').toUpperCase();
    const plaintextNums = plaintext.toUpperCase().split('').map(char => char.charCodeAt(0) - 65);
    let ciphertext = '';

    for (let i = 0; i < plaintextNums.length; i += 2) {
        const block = [plaintextNums[i], plaintextNums[i + 1] || 0]; // Padding with 0 if necessary
        const encryptedBlock = matrixMultiply(key, block, modulus);
        ciphertext += String.fromCharCode(encryptedBlock[0] + 65) + String.fromCharCode(encryptedBlock[1] + 65);
    }

    return ciphertext;
}

function clearInput() {
    let takeData = document.getElementById("takeText");
    let OutputArea = document.getElementById("OutputArea");
    takeData.value = "";   
    OutputArea.value = "";
}
function encryptDataHillCipher(){
    const key = [
        [3, 3],
        [2, 5]
    ];
    let takeData = document.getElementById("takeText").value;
    let encryptedCipher = hillEncrypt(takeData,key);
    let OutputArea = document.getElementById("OutputArea");
    OutputArea.value = encryptedCipher;
}

// Function to find the modular multiplicative inverse of a number (for decryption)
function modInverse(a, m) {
    a = a % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return 1; // In case there's no modular inverse (not applicable here as m=26 is prime)
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

// Function to decrypt ciphertext using Hill cipher
function hillDecrypt(ciphertext, key, modulus = 26) {
    const inverseKey = matrixInverse(key, modulus);
    let plaintext = '';

    for (let i = 0; i < ciphertext.length; i += 2) {
        const block = [ciphertext.charCodeAt(i) - 65, ciphertext.charCodeAt(i + 1) - 65];
        const decryptedBlock = matrixMultiply(inverseKey, block, modulus);
        plaintext += String.fromCharCode(decryptedBlock[0] + 65) + String.fromCharCode(decryptedBlock[1] + 65);
    }

    return plaintext.replace(/X*$/, ''); // Remove padding if any
}

function decryptData(){
    const key = [
        [3, 3],
        [2, 5]
    ];
    let takeDecryptData = document.getElementById("takeDecryptText").value;
    let decryptedData = hillDecrypt(takeDecryptData,key);
    decryptedData = decryptedData.replace(":"," ");
    let takeData = document.getElementById("takeText").value;
    let decryptArray = decryptedData.split('');
    let spaceCount = 0;
    for (let i = 0; i < takeData.length; i++) {
        if (takeData[i] === ' ') {
            decryptArray.splice(i + spaceCount, 0, ' '); 
            spaceCount++;
        }
    }
    decryptedData = decryptArray.join('');
    let decryptedData2 = decryptedData.slice(0,-1);
    
    if(decryptedData2 == takeData){
        let OutputDecryptArea = document.getElementById("OutputDecryptArea");
        OutputDecryptArea.value = decryptedData2;
    }
    else{
        let OutputDecryptArea = document.getElementById("OutputDecryptArea");
        OutputDecryptArea.value = decryptedData;    
    }
}

function clearDecryptInput() {
    let takeData = document.getElementById("takeDecryptText");
    let output = document.getElementById("OutputDecryptArea");
    takeData.value = "";   
    output.value  = "";
}