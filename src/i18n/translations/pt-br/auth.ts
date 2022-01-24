// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Login',
    loginError: 'Usuário ou senha inválido!',
    error: 'Houve um erro ao realizar o login! Tente novamente.',
    inputs:{
        email: 'E-mail',
        emailPlaceholder:'Digite seu e-mail',
        password: 'Senha',
        passwordPlaceholder: 'Digite sua senha'
    },
    validation: {
        password: 'A senha deve ser digitada!',
        email: 'Digite um e-mail válido!',
        invalidEmail: 'O endereço de e-mail digitado é inválido!'
    }
}