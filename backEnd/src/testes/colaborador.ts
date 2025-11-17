import { ColaboradorDB } from "../repository/colaboradorRepository.js";

const colaborador = new ColaboradorDB()

class ColaboradorTest{
    async executeDeleteColaborador(){
        const deleteColaborador = await colaborador.deleteColaboradorId(1,1)
    }
    async executeBuscarColaborador(){
        const buscarColaborador = await colaborador.buscarColaboradorId(1)
        console.log(buscarColaborador)
    }
}
const main = new ColaboradorTest();
main.executeDeleteColaborador();
