export const generateToken = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
};

export const generateTransactionId = () => {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const timestamp = Date.now().toString(36).toUpperCase();
  const array = new Uint8Array(10);
  window.crypto.getRandomValues(array);
  const random = Array.from(array, (b) => CHARS[b % CHARS.length]).join("");
  return `TRXN-${timestamp}-${random}`;
};

export const generateReceiptId = () => {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const timestamp = Date.now().toString(36).toUpperCase();
  const array = new Uint8Array(12);
  window.crypto.getRandomValues(array);
  const random = Array.from(array, (b) => CHARS[b % CHARS.length]).join("");
  return `RCPT-${timestamp}-${random}`;
};
