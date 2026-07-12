from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import httpx
import os
from datetime import datetime
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/copilot", tags=["AI Copilot"])

class ChatPayload(BaseModel):
    prompt: str

@router.post("/chat")
async def copilot_chat(
    payload: ChatPayload,
    current_user: User = Depends(get_current_user)
):
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Gemini API key is not configured on the backend server."
        )

    system_prompt = (
        "You are the EcoSphere ESG Intelligence Assistant, a premium AI sustainability analyst.\n"
        "You help corporate users analyze Scope 1, 2, and 3 emissions, carbon accounting ledger transactions, compliance frameworks (GRI, SASB), and reduction target pathways.\n\n"
        "Rules for response formatting:\n"
        "1. Provide concise, premium, executive-level insights. Use markdown bullet points and headings.\n"
        "2. If you want to render a visual chart to help illustrate the data, append exactly one of the following tags at the very end of your response:\n"
        "   - [CHART:bar] to show comparison between categories/departments.\n"
        "   - [CHART:pie] to show breakdown/distribution of a total value.\n"
        "   - [CHART:area] to show cumulative trends or pathways over time.\n"
        "   - [CHART:radar] to show multi-variable compliance indicators.\n"
        "3. If you want to present a tabular log of items, use markdown table formatting.\n"
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    
    # Gemini API payload layout
    data = {
        "contents": [
            {
                "parts": [
                    {"text": system_prompt + "\nUser Query: " + payload.prompt}
                ]
            }
        ]
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, headers=headers, json=data)
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Gemini API returned error: {response.text}"
                )
                
            result_json = response.json()
            candidates = result_json.get("candidates", [])
            if candidates:
                text_content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                return {"text": text_content}
            else:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="No chat completion candidates returned from Gemini API."
                )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to communicate with AI model: {str(e)}"
        )
