from statistics import mean
from backend.app import storage
from model.features import extract_features

def update_profile(tid,recent):
    samples=storage.trainee_samples(tid,500) or recent
    f=extract_features(samples)
    errors=[abs(float(s.get('position_error',0) or 0)) for s in samples]
    reactions=[max(0,float(s.get('reaction_time',0) or 0)) for s in samples]
    profile={"features":f,"mean_position_error":round(mean(errors),4) if errors else 0,"mean_reaction_time":round(mean(reactions),4) if reactions else 0,"strengths":[],"practice_areas":[]}
    (profile['strengths'] if f['attitude_error_mean']<.2 and f['control_smoothness']<.15 else profile['practice_areas']).append("stable control" if f['attitude_error_mean']<.2 and f['control_smoothness']<.15 else "stability and smooth control")
    (profile['practice_areas'] if profile['mean_reaction_time']>1.5 else profile['strengths']).append("reaction time")
    storage.save_profile(tid,len(samples),profile)
    return {"trainee_id":tid,"sample_count":len(samples),"profile":profile}
