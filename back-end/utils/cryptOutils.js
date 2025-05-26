const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.SECRET_KEY, 'hex');

function encrypt(text) {
  if (typeof text === 'number')
    text=text.toString()  
  if (typeof text === 'boolean')
    text=text.toString() 
  if (!text || typeof text !== 'string') return '';
    
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; 
}

function decrypt(encryptedText) {

  if (!encryptedText || typeof encryptedText !== 'string') return '';

  const [ivHex, data] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
 
  if (decrypted === "true") decrypted = true;
  if (decrypted === "false") decrypted = false;

  if (/^-?\d+$/.test(decrypted)) {
    return parseInt(decrypted, 10);
  }
  return decrypted;
}

function hashed(text) {
  if (!text || typeof text !== 'string') return '';
  return crypto.createHash('sha256').update(text).digest('hex');
}

module.exports = { encrypt, decrypt,hashed };
