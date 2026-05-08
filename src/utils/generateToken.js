import Hashids from "hashids";

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

// generate a random unique alphanumeric string to obuscate course id in url
const secret_key = import.meta.env.VITE_COURSEID_HASH_SECRET;
const hashids = new Hashids(secret_key, 15);

export const encodeCourseID = (courseId) => {
  return hashids.encode(courseId);
};

export const decodeCourseID = (encodedId) => {
  const decoded = hashids.decode(encodedId);
  return decoded.length > 0 ? decoded[0] : null;
}
