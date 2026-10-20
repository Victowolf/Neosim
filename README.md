# NEOSIM —Simulation & Training Backend

This repository follows the stack named in the submitted PPT: **Gazebo, PX4 SITL, ROS 2, uXRCE-DDS, MAVLink, and Python**. It deliberately excludes Unity.

The code provides a software-only starter for scenario/session control, simulated telemetry ingestion, Flight Behaviour Profile (FBP), a Random Forest behaviour model, bounded difficulty recommendations, after-action reports, and an optional generic LLM endpoint. ROS 2 integration is provided as a scenario-control node scaffold. PX4 SITL/Gazebo installations are external prerequisites; this repository does not bundle them or claim they are already connected.

## Folder structure

```text
NEOSIM_SIH26247_Stack/
├── README.md
├── .env.example
├── requirements.txt
├── model/                         # telemetry features and ML behaviour classifier
│   ├── README.md
│   ├── features.py
│   ├── behavior_model.py
│   └── train_behavior_model.py
├── backend/                       # REST API, persistence, services, reports, LLM adapter
│   ├── README.md
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── schemas.py
│   │   ├── storage.py
│   │   ├── api/routes.py
│   │   └── services/
│   └── tests/test_smoke.py
└── ros2_ws/src/neosim_ros/
    ├── package.xml
    ├── setup.py
    ├── resource/neosim_ros
    ├── neosim_ros/scenario_controller.py
    ├── neosim_ros/telemetry_bridge.py
    └── worlds/neosim_training.sdf
```

## What the code implements

- **Backend REST API:** session start/pause/resume/stop, scenario catalog, telemetry ingestion, FBP lookup, behaviour prediction, adaptive-difficulty recommendation, report generation and LLM text generation.
- **FBP model:** extracts speed variation, position error, attitude error, control-input changes and recovery time from telemetry. Profiles are updated after telemetry is received.
- **ML:** Random Forest classifier labels windows `stable`, `needs_practice`, or `unstable`. A synthetic-data training script is included to verify the wiring only; its scores are not research evidence.
- **ROS 2:** a ROS 2 Python node accepts high-level demo commands (`start`, `pause`, `resume`, `stop`, `scenario`) and publishes a JSON control message. A second node provides a bridge topic for telemetry JSON. Connect these topics to your own approved PX4/Gazebo adapter.
- **Gazebo:** a minimal SDF world for a training environment. Add the PX4 Gazebo model/plugins that match the installed PX4/Gazebo version.
- **LLM:** generic environment variables `LLM_PROVIDER`, `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`; keys remain on the backend.

## 1. Backend setup

Requires Python 3.10+ (3.11 recommended).

```bash
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
# Windows: copy .env.example .env
# macOS/Linux: cp .env.example .env
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000/docs`; health check is `http://localhost:8000/health`. SQLite is created at `backend/neosim.db`.

## 2. Train the demo ML model

From repository root:

```bash
python -m model.train_behavior_model
```

This writes `model/artifacts/behavior_model.joblib`. The included data is synthetic and only intended to test the pipeline. For a valid project evaluation, collect and label repeatable telemetry from simulation runs, split train/test by scenario or session, and report Macro-F1 on held-out data.

## 3. ROS 2 package

Install ROS 2 and a compatible Gazebo/PX4 SITL environment separately. Then, from `ros2_ws`:

```bash
source /opt/ros/$ROS_DISTRO/setup.bash
colcon build --symlink-install
source install/setup.bash
ros2 run neosim_ros scenario_controller
```

The node publishes JSON messages to `/neosim/simulation_command`. This is a high-level integration seam, not a direct PX4 control implementation. Your integration adapter should translate these commands to the exact PX4/Gazebo version and remain confined to SITL.

The sample world can be opened with the Gazebo Sim version compatible with your environment, for example `gz sim src/neosim_ros/worlds/neosim_training.sdf`. PX4 model/plugin configuration varies by release; follow the matching PX4 SITL documentation rather than copying plugin names across versions.

## 4. Frontend API

Base URL: `http://localhost:8000`

- `GET /health`
- `GET /api/v1/scenarios`
- `POST /api/v1/simulation/start`
- `POST /api/v1/simulation/{session_id}/pause`
- `POST /api/v1/simulation/{session_id}/resume`
- `POST /api/v1/simulation/{session_id}/stop`
- `GET /api/v1/simulation?trainee_id=...`
- `POST /api/v1/telemetry`
- `GET /api/v1/profiles/{trainee_id}`
- `POST /api/v1/models/behavior/predict`
- `POST /api/v1/adaptation/recommend`
- `GET /api/v1/reports/{session_id}`
- `POST /api/v1/llm/generate`

Set `FRONTEND_ORIGINS` in `.env` to your frontend origins, comma-separated. Since the frontend code was not attached, the API contract is generic and may need small field-name adjustments to match your UI.

## 5. LLM configuration and API keys

Copy `.env.example` to `.env` and fill the provider-specific values:

```dotenv
LLM_PROVIDER=custom
LLM_API_KEY=your_secret_key_here
LLM_BASE_URL=https://your-provider.example/v1
LLM_MODEL=your-model-name
```

The adapter uses an OpenAI-compatible `/chat/completions` payload. If your provider uses a different protocol, update `backend/app/services/llm_service.py`. Never expose `LLM_API_KEY` to browser code, mobile apps, ROS topics or source control. No API key is bundled in this ZIP.

## 6. Evaluation targets from the PPT

The PPT lists Macro-F1 0.90, FBP reliability/ICC 0.89, adaptive-training relative gain 0.90, adaptive decision accuracy 0.91, and update success rate 0.90 as expected values. These are targets, not results produced by this starter. Evaluate them with a documented dataset and fixed-difficulty baseline before claiming achievement.

## Limitations

- Gazebo/PX4 SITL and ROS 2 are not bundled; versions must be installed and matched locally.
- ROS 2 controller code publishes high-level scenario messages; it does not yet implement a version-specific PX4 bridge.
- The world file is a starting environment, not a complete multi-vehicle world with PX4 plugins.
- No real-world drone commands, interception behaviours, targeting, or weapon functions are included. Use this for controlled simulation and training only.
