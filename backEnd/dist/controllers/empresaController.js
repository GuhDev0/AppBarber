import { EmpresaService } from "../services/EmpresaService.js";
const empresaService = new EmpresaService();
export class EmpresaController {
    empresaCreate = async (req, res) => {
        const empresaReq = req.body;
        try {
            const empresaCreate = await empresaService.createEmpresaService(empresaReq);
            return res.status(201).json(empresaCreate);
        }
        catch (error) {
            return res.status(500).json({ mensagem: error.message });
        }
    };
    buscarPeloId = async (req, res) => {
        const { id } = req.params;
        const empresaId = Number(id);
        if (isNaN(empresaId)) {
            return res.status(400).json({ mensagem: "ID inválido" });
        }
        try {
            const empresa = await empresaService.empresaFindByIdService(empresaId);
            if (!empresa) {
                return res.status(404).json({ mensagem: "Empresa não encontrada" });
            }
            return res.status(200).json(empresa);
        }
        catch (error) {
            return res.status(500).json({ mensagem: error.message });
        }
    };
}
