from fastapi.testclient import TestClient
from backend.app.main import app
client=TestClient(app)
def test_health():
    r=client.get('/health'); assert r.status_code==200 and r.json()['status']=='ok'
def test_scenarios():
    r=client.get('/api/v1/scenarios'); assert r.status_code==200 and len(r.json())>=1
def test_adaptation_bounded():
    r=client.post('/api/v1/adaptation/recommend',json={"trainee_id":"demo","current_difficulty":5,"behavior_label":"stable","performance_score":99,"instructor_max_difficulty":5})
    assert r.status_code==200 and r.json()['recommended_difficulty']<=5
