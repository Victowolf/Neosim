from fastapi import APIRouter, HTTPException
from backend.app import storage
from backend.app.schemas import StartSessionRequest,TelemetryBatch,BehaviorPredictRequest,AdaptationRequest,LLMRequest
from backend.app.services import simulation_service,profile_service,adaptation_service,report_service,llm_service
from model.behavior_model import BehaviorModel
router=APIRouter(); behavior=BehaviorModel()
@router.get('/scenarios')
def scenarios():
    return [{"scenario_id":"basic-navigation","name":"Basic navigation","environment":"training_field","difficulty":1,"drone_count":1},{"scenario_id":"multi-drone-awareness","name":"Multi-drone awareness","environment":"urban","difficulty":2,"drone_count":3},{"scenario_id":"reduced-visibility","name":"Reduced visibility","environment":"forest","difficulty":3,"drone_count":3}]
@router.post('/simulation/start')
def start(body:StartSessionRequest): return simulation_service.start(body.trainee_id,body.scenario.model_dump())
def change(sid,status):
    row=simulation_service.set_status(sid,status)
    if not row: raise HTTPException(404,'Session not found')
    return row
@router.post('/simulation/{sid}/pause')
def pause(sid:str):return change(sid,'paused')
@router.post('/simulation/{sid}/resume')
def resume(sid:str):return change(sid,'running')
@router.post('/simulation/{sid}/stop')
def stop(sid:str):return change(sid,'stopped')
@router.get('/simulation')
def sessions(trainee_id:str|None=None):return storage.list_sessions(trainee_id)
@router.post('/telemetry')
def telemetry(batch:TelemetryBatch):
    touched={}
    for sample in batch.samples:
        p=sample.model_dump(mode='json'); storage.save_telemetry(p); touched.setdefault(sample.trainee_id,[]).append(p)
    return {"accepted":len(batch.samples),"profiles_updated":[profile_service.update_profile(t,s) for t,s in touched.items()]}
@router.get('/profiles/{tid}')
def profile(tid:str):return storage.get_profile(tid) or {"trainee_id":tid,"sample_count":0,"profile":None}
@router.post('/models/behavior/predict')
def predict(body:BehaviorPredictRequest):return behavior.predict(body.samples)
@router.post('/adaptation/recommend')
def adaptation(body:AdaptationRequest):return adaptation_service.recommend(body.current_difficulty,body.behavior_label,body.performance_score,body.instructor_max_difficulty)
@router.get('/reports/{sid}')
def report(sid:str):
    result=report_service.build(sid)
    if not result:raise HTTPException(404,'Session not found')
    return result
@router.post('/llm/generate')
async def llm(body:LLMRequest):
    try:return await llm_service.generate(body.task,body.prompt,body.context)
    except Exception as exc:raise HTTPException(502,f'LLM provider request failed: {type(exc).__name__}')
