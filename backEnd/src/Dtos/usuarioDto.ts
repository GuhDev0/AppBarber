export default interface usuarioDto {
    nomeCompleto: string,
    email: string,
    senha: string,
    telefone:string,
    cpf:string,
    tipoDaConta: "USER" | "ADMIN"
}