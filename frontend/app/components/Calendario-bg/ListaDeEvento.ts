import { api } from "@/app/lib/api";
import { useState } from "react";
interface Agendamento {
    id: number;
    title: string;
    start: Date;
    end: Date;
    colaboradorId?: number;
}

const [agendamento, setAgendamento] = useState<Agendamento[]>([]);

const buscarAgendamento = async () => {
    try {
        const response = await api.get("/agendamento"); 
        setAgendamento(response.data); 
    } catch (error) {
        console.error("Erro ao buscar agendamento:", error);
        return [];
    }
}




const  listaDeAgenmento = agendamento;


export default listaDeAgenmento