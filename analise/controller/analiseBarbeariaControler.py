from fastapi import FastAPI, Request, HTTPException,APIRouter
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
from services.colaborador_analise import analise_colaborador_service
from services.barbaeria_analise import analise_barbearia
from dotenv import load_dotenv
import os

load_dotenv()

CHAVE_SECRETA = os.getenv("CHAVE_SECRETA")
ALGORITHM = os.getenv("ALGORITHM")

if not CHAVE_SECRETA or not ALGORITHM:
    raise RuntimeError("Variáveis de ambiente não configuradas corretamente")

router = APIRouter()

@router.get("/analise/barbearia")
def analise_barbearia_endpoint(request: Request):
    auth = request.headers.get("Authorization")

    if not auth:
        raise HTTPException(status_code=401, detail="Token não fornecido")

    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Formato de token inválido")

    token = auth.replace("Bearer ", "")

    try:
        payload = jwt.decode(
            token,
            CHAVE_SECRETA,
            algorithms=[ALGORITHM]
        )

        return {
            "analise": analise_barbearia(payload["empresaId"])
        }

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")

    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    return {
        "Analise": analise_barbearia(payload["empresaId"])
    }
    
@router.get("/analise/colaborador/{colaborador_id}")
def analise_colaborador_endpoint(colaborador_id: int, request: Request):    
    auth = request.headers.get("Authorization")
    if not auth:
        raise HTTPException(status_code=401, detail="Token não fornecido")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Formato de token inválido")
    token = auth.replace("Bearer ", "")
    try:
        payload = jwt.decode(
            token,
            CHAVE_SECRETA,
            algorithms=[ALGORITHM]
        )
        return {
            "analise": analise_colaborador_service(colaborador_id, payload["empresaId"])
        }
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    