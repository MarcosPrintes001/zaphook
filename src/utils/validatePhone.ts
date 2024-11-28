// src/utils/validatePhone.ts
function isPhoneNumberValid(phone: string): boolean {
    return /^\d{10,15}$/.test(phone); // Exemplo: valida número entre 10 e 15 dígitos
}

export default isPhoneNumberValid;
