from statistics import mean
from backend.app import storage

def build(sid):
    session=storage.get_session(sid)
    if not session:return None
    samples=storage.session_samples(sid); errors=[abs(float(s.get('position_error',0) or 0)) for s in samples]; reactions=[max(0,float(s.get('reaction_time',0) or 0)) for s in samples]
    return {"session_id":sid,"trainee_id":session['trainee_id'],"status":session['status'],"sample_count":len(samples),"mean_position_error":round(mean(errors),4) if errors else 0,"mean_reaction_time":round(mean(reactions),4) if reactions else 0,"scenario":__import__('json').loads(session['scenario_json']),"notes":"Instructor review required."}
