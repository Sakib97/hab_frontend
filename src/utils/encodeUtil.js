
import CryptoJS from "crypto-js";
// export const SECRET_KEY = process.env.JWT_SECRET;
// for encoding email
export const basicEncode = (data) => {
    return btoa(data).replace(/=/g, '');
    // return btoa(data.split('').reverse().join('')).replace(/=/g, '');
};

const SECRET_KEY = "your-32-byte-secret-key-goes-here"; // Replace securely

export const aesEncode = (data) => {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(data,
        CryptoJS.enc.Utf8.parse(SECRET_KEY),
        { iv: iv });
    const combined = iv.concat(encrypted.ciphertext);
    return combined.toString(CryptoJS.enc.Base64url); // Or Base64
}

// export const aesDecode = (encrypted) => {
//     const data = CryptoJS.enc.Base64url.parse(encrypted);
//     const ivWords = data.words.slice(0, 4); // 4 words = 16 bytes
//     const ctWords = data.words.slice(4);

//     const iv = CryptoJS.lib.WordArray.create(ivWords, 16);
//     const ciphertext = CryptoJS.lib.WordArray.create(ctWords, data.sigBytes - 16);

//     const decrypted = CryptoJS.AES.decrypt(
//         { ciphertext },
//         CryptoJS.enc.Utf8.parse(SECRET_KEY),
//         { iv }
//     );
//     return decrypted.toString(CryptoJS.enc.Utf8);
// }

export const xorEncode = (str, key=42) => {
    if (typeof str !== 'string') {
        str = String(str); // convert to string safely
      }
    const chars = [...str].map(c => String.fromCharCode(c.charCodeAt(0) ^ key));
    const xored = chars.join('');
    return btoa(xored);  // Base64 encode the XORed string
  }
  
  export const xorDecode = (encoded, key=42) => {
    if (typeof encoded !== 'string') {
        encoded = String(encoded); // convert to string safely
      }
    const xored = atob(encoded);
    const chars = [...xored].map(c => String.fromCharCode(c.charCodeAt(0) ^ key));
    return chars.join('');
  }


