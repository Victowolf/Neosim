from uuid import uuid4
from backend.app import storage

def start(trainee_id, scenario):
    sid=str(uuid4()); started=storage.create_session(sid,trainee_id,scenario)
    return {"session_id":sid,"trainee_id":trainee_id,"status":"running","scenario":scenario,"started_at":started,"simulation_adapter":"ros2_topic_scaffold"}
def set_status(sid,status):
    row=storage.update_status(sid,status)
    if row: row['scenario']=__import__('json').loads(row.pop('scenario_json'))
    return row
