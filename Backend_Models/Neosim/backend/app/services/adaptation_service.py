def recommend(current, label, score, cap=5):
    current=max(1,min(5,int(current))); cap=max(1,min(5,int(cap)))
    if label=="stable" and score>=85: proposed=min(current+1,cap); reason="Performance supports a small increase within instructor limits."
    elif label=="unstable" or score<50: proposed=max(1,current-1); reason="Reduce difficulty and practise core control skills."
    else: proposed=current; reason="Maintain difficulty and collect more evidence."
    return {"current_difficulty":current,"recommended_difficulty":proposed,"change":proposed-current,"reason":reason,"requires_instructor_confirmation":True}
