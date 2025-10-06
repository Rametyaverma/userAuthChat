// // src/utils/auth.js
// // small helper for token storage & validation

// // Save token. remember = true -> localStorage, else sessionStorage
// export function setToken(token, remember = false) {
//   const storage = remember ? localStorage : sessionStorage;
//   storage.setItem("token", token);

//   // Optional: also store explicit expiry if backend returns expiresAt
//   // storage.setItem("token_expires_at", expiresAt);
// }

// // Read token from either storage (prefers localStorage)
// export function getToken() {
//   return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
// }

// // Remove token from both storages (logout)
// export function removeToken() {
//   localStorage.removeItem("token");
//   sessionStorage.removeItem("token");
//   localStorage.removeItem("token_expires_at");
//   sessionStorage.removeItem("token_expires_at");
// }

// // Validate JWT expiry by decoding payload (no npm required)
// export function isTokenExpired(token) {
//   if (!token) return true;
//   try {
//     const payload = token.split(".")[1];
//     if (!payload) return true;
//     const decoded = JSON.parse(atob(payload));
//     if (!decoded.exp) return false; // if no exp claim assume not expired (or handle otherwise)
//     // exp is in seconds since epoch
//     return Date.now() >= decoded.exp * 1000;
//   } catch (e) {
//     // any error -> treat as expired/invalid
//     return true;
//   }
// }
