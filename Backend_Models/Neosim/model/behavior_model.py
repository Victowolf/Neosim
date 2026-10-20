from pathlib import Path
import joblib
from model.features import extract_features, feature_row
ARTIFACT = Path(__file__).resolve().parent / "artifacts" / "behavior_model.joblib"

class BehaviorModel:
    def __init__(self):
        self.pipeline = None
        if ARTIFACT.exists():
            try: self.pipeline = joblib.load(ARTIFACT)
            except Exception: self.pipeline = None

    def predict(self, samples: list[dict]) -> dict:
        f = extract_features(samples)
        if self.pipeline is not None:
            probs = self.pipeline.predict_proba([feature_row(f)])[0]
            classes = list(self.pipeline.classes_)
            return {"label": str(classes[int(probs.argmax())]), "confidence": float(probs.max()),
                    "probabilities": {str(c): float(p) for c,p in zip(classes, probs)}, "features": f, "model": "random_forest"}
        risk = (0.35*min(f["attitude_error_mean"]/0.8,1) + 0.25*min(f["control_smoothness"]/0.5,1) + 0.25*min(f["position_variability"]/1,1) + 0.15*min(f["recovery_time"]/8,1))
        label = "stable" if risk < .25 else ("needs_practice" if risk < .58 else "unstable")
        return {"label": label, "confidence": round(1-abs(risk-{"stable":.1,"needs_practice":.4,"unstable":.8}[label]),3), "probabilities": {}, "features": f, "model": "heuristic_fallback"}
