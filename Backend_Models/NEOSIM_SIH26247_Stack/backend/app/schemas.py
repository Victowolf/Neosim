from datetime import datetime, timezone
from typing import Any, Literal
from pydantic import BaseModel, Field
class Scenario(BaseModel):
    scenario_id: str = "basic-navigation"
    name: str = "Basic navigation"
    environment: Literal["training_field","urban","forest","mountain"] = "training_field"
    difficulty: int = Field(1, ge=1, le=5)
    drone_count: int = Field(1, ge=1, le=12)
    sensor_noise: float = Field(0, ge=0, le=1)
    visibility: float = Field(1, ge=.1, le=1)
class StartSessionRequest(BaseModel):
    trainee_id: str = Field(min_length=1, max_length=100)
    scenario: Scenario = Field(default_factory=Scenario)
class TelemetrySample(BaseModel):
    session_id: str
    trainee_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    drone_id: str = "trainee-drone"
    x: float = 0; y: float = 0; z: float = 0
    vx: float = 0; vy: float = 0; vz: float = 0
    roll: float = 0; pitch: float = 0; yaw: float = 0
    position_error: float = 0; attitude_error: float = 0
    control_input: float = 0; reaction_time: float = 0; recovery_time: float = 0
    extras: dict[str, Any] = Field(default_factory=dict)
class TelemetryBatch(BaseModel): samples: list[TelemetrySample] = Field(min_length=1, max_length=2000)
class BehaviorPredictRequest(BaseModel): samples: list[dict[str, Any]] = Field(min_length=1, max_length=2000)
class AdaptationRequest(BaseModel):
    trainee_id: str
    current_difficulty: int = Field(ge=1, le=5)
    behavior_label: str
    performance_score: float = Field(ge=0, le=100)
    instructor_max_difficulty: int = Field(5, ge=1, le=5)
class LLMRequest(BaseModel):
    task: str = Field(min_length=1, max_length=80)
    prompt: str = Field(min_length=1, max_length=5000)
    context: dict[str, Any] = Field(default_factory=dict)
