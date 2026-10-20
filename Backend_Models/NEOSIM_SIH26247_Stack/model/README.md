# Model folder

`features.py` derives a fixed numeric feature vector from telemetry. `behavior_model.py` loads a trained Random Forest or uses a transparent heuristic fallback. `train_behavior_model.py` creates a demo model from synthetic records to check the pipeline. Replace synthetic examples with labelled Gazebo/PX4 SITL data before evaluating or publishing results.
