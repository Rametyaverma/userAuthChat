// export const validateEmail = (email) => {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return re.test(email);
// };

// export const validatePassword = (password) => {
//   const minLength = password.length >= 8;
//   const hasUppercase = /[A-Z]/.test(password);
//   const hasNumber = /\d/.test(password);
//   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

//   return {
//     minLength,
//     hasUppercase,
//     hasNumber,
//     hasSpecialChar,
//     isValid: minLength && hasUppercase && hasNumber && hasSpecialChar,
//   };
// };

// export const calculateAge = (dob) => {
//   const today = new Date();
//   const birthDate = new Date(dob);
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
  
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
  
//   return age;
// };