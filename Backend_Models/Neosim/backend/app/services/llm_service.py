import httpx
from backend.app.config import settings
async def generate(task,prompt,context):
    provider=settings.llm_provider.strip().lower()
    if provider in ('','none','disabled') or not all([settings.llm_api_key,settings.llm_base_url,settings.llm_model]):
        return {"provider":provider or "none","configured":False,"output":"LLM not configured. Set LLM_PROVIDER, LLM_API_KEY, LLM_BASE_URL and LLM_MODEL in backend .env."}
    url=settings.llm_base_url.rstrip('/')
    if not url.endswith('/chat/completions'):url+='/chat/completions'
    body={"model":settings.llm_model,"messages":[{"role":"system","content":"You assist with simulated drone training summaries and learning feedback. Do not provide real-world targeting or interception instructions."},{"role":"user","content":f"Task: {task}\nContext: {context}\nRequest: {prompt}"}],"temperature":0.2}
    async with httpx.AsyncClient(timeout=settings.llm_timeout_seconds) as client:
        r=await client.post(url,json=body,headers={"Authorization":f"Bearer {settings.llm_api_key}"}); r.raise_for_status(); data=r.json()
    return {"provider":provider,"configured":True,"output":data.get('choices',[{}])[0].get('message',{}).get('content','')}
