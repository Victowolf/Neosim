from __future__ import annotations
import math
from statistics import mean, pstdev
from typing import Any, Iterable

FEATURE_NAMES = ["mean_speed", "speed_variability", "position_variability", "attitude_error_mean", "control_smoothness", "recovery_time", "telemetry_sample_count"]

def _num(sample: dict[str, Any], key: str, default: float = 0.0) -> float:
    try:
        value = float(sample.get(key, default))
        return value if math.isfinite(value) else default
    except (TypeError, ValueError):
        return default

def extract_features(samples: Iterable[dict[str, Any]]) -> dict[str, float]:
    rows = list(samples)
    if not rows:
        return {name: 0.0 for name in FEATURE_NAMES}
    speeds, pos_errors, attitude_errors, changes, recovery = [], [], [], [], []
    prev = None
    for row in rows:
        vx, vy, vz = (_num(row, k) for k in ("vx", "vy", "vz"))
        speeds.append(math.sqrt(vx*vx + vy*vy + vz*vz))
        pos_errors.append(abs(_num(row, "position_error")))
        attitude_errors.append(abs(_num(row, "attitude_error")))
        control = _num(row, "control_input")
        if prev is not None: changes.append(abs(control-prev))
        prev = control
        if "recovery_time" in row: recovery.append(max(0.0, _num(row, "recovery_time")))
    return {
        "mean_speed": mean(speeds),
        "speed_variability": pstdev(speeds) if len(speeds)>1 else 0.0,
        "position_variability": pstdev(pos_errors) if len(pos_errors)>1 else pos_errors[0],
        "attitude_error_mean": mean(attitude_errors),
        "control_smoothness": mean(changes) if changes else 0.0,
        "recovery_time": mean(recovery) if recovery else 0.0,
        "telemetry_sample_count": float(len(rows)),
    }

def feature_row(features: dict[str, float]) -> list[float]:
    return [float(features.get(k, 0.0)) for k in FEATURE_NAMES]
