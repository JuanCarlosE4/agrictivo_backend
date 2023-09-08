import bcrypt from 'bcrypt'

// ENCRIPTAR PASSWORD
export const encrypt = async (password_user) => {
    const passwordhash = await bcrypt.hash(password_user, 10)
    return passwordhash
}

// FUNCION PARA COMPARAR PASSWORD
export const compare = async (password, user_password) => {
    return await bcrypt.compare(password, user_password)
}