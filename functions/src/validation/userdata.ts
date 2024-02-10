export const validateEmail = (email: string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email); 

export const validatePassword = (password: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

export function validateEmailAndPassword(email:string, password:string) {
    
    if (!email || !password) return false;
    if (!validateEmail(email)) return false;
    if (!validatePassword(password)) return false;

    return true;
}