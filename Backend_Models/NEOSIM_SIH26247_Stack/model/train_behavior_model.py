from pathlib import Path
import random, joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

def main():
    random.seed(42); X=[]; y=[]
    ranges = {
      "stable": [(0.1,2.0),(0.01,.25),(0,.25),(0,.2),(0,.15),(0,2),(5,60)],
      "needs_practice": [(.2,3),(.15,.8),(.15,.8),(.15,.65),(.1,.6),(1,6),(5,60)],
      "unstable": [(.1,4),(.5,1.8),(.5,2),(.5,1.8),(.4,1.5),(4,15),(5,60)]}
    for _ in range(900):
        label=random.choice(list(ranges)); vals=[]
        for i,(lo,hi) in enumerate(ranges[label]): vals.append(random.randint(int(lo),int(hi)) if i==6 else random.uniform(lo,hi))
        X.append(vals); y.append(label)
    model=make_pipeline(StandardScaler(),RandomForestClassifier(n_estimators=180,class_weight="balanced",random_state=42)).fit(X,y)
    target=Path(__file__).resolve().parent/"artifacts"/"behavior_model.joblib"; target.parent.mkdir(parents=True,exist_ok=True); joblib.dump(model,target)
    print(f"Saved demo model to {target}; synthetic data is not valid research evidence.")
if __name__ == "__main__": main()
