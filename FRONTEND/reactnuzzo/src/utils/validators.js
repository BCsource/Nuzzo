// Regras de validação do Register, edit profile etc partilhadas entre págs aqui para nao repetir regex 


export const EMAIL_PATTERN = {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Set a valid email address.',
};

export const NAME_MIN_LENGTH = { value: 2, message: 'Name must be at least 2 characters.' };
export const NAME_MAX_LENGTH = { value: 50, message: 'Too long! Keep it under 50 characters.' };

export const MIN_AGE = 18;
export const MAX_AGE = 120;

//User age calculada pela data de nascimento

export function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function validateAge(dateOfBirth) {
    if (!dateOfBirth) return 'Set your Birth Date.';
    const age = calculateAge(dateOfBirth);
    if (age < MIN_AGE || age > MAX_AGE) {
        return `You have to be between ${MIN_AGE} and ${MAX_AGE} years old to register.`;
    }
    return true;
}

// Password reqs

export function validatePasswordStrength(value) {
    if (!value || value.length < 6) return 'Your password must be at least 6 characters long.';
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[^a-zA-Z0-9]/.test(value);
    if (!hasLetter || !hasNumber || !hasSpecial) {
        return 'Password requires at least 1 letter, 1 number and 1 special character.';
    }
    return true;
}
