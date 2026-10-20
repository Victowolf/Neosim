import json, sqlite3
from pathlib import Path
from datetime import datetime, timezone
from backend.app.config import settings

def _connect():
    path=Path(settings.database_path); path.parent.mkdir(parents=True,exist_ok=True)
    c=sqlite3.connect(path,check_same_thread=False); c.row_factory=sqlite3.Row; return c

def init_db():
    with _connect() as c:
        c.execute("CREATE TABLE IF NOT EXISTS sessions(session_id TEXT PRIMARY KEY,trainee_id TEXT,status TEXT,scenario_json TEXT,started_at TEXT,ended_at TEXT)")
        c.execute("CREATE TABLE IF NOT EXISTS telemetry(id INTEGER PRIMARY KEY AUTOINCREMENT,session_id TEXT,trainee_id TEXT,timestamp TEXT,payload_json TEXT)")
        c.execute("CREATE TABLE IF NOT EXISTS profiles(trainee_id TEXT PRIMARY KEY,sample_count INTEGER,profile_json TEXT,updated_at TEXT)")
def create_session(sid,tid,scenario):
    now=datetime.now(timezone.utc).isoformat()
    with _connect() as c: c.execute("INSERT INTO sessions VALUES(?,?,?,?,?,NULL)",(sid,tid,"running",json.dumps(scenario),now))
    return now
def get_session(sid):
    with _connect() as c: r=c.execute("SELECT * FROM sessions WHERE session_id=?",(sid,)).fetchone()
    return dict(r) if r else None
def update_status(sid,status):
    with _connect() as c:
        c.execute("UPDATE sessions SET status=?,ended_at=CASE WHEN ?='stopped' THEN ? ELSE ended_at END WHERE session_id=?",(status,status,datetime.now(timezone.utc).isoformat(),sid))
    return get_session(sid)
def list_sessions(tid=None):
    with _connect() as c:
        rows=c.execute("SELECT * FROM sessions WHERE trainee_id=? ORDER BY started_at DESC",(tid,)).fetchall() if tid else c.execute("SELECT * FROM sessions ORDER BY started_at DESC LIMIT 100").fetchall()
    return [dict(r) for r in rows]
def save_telemetry(s):
    with _connect() as c: c.execute("INSERT INTO telemetry(session_id,trainee_id,timestamp,payload_json) VALUES(?,?,?,?)",(s['session_id'],s['trainee_id'],s['timestamp'],json.dumps(s)))
def session_samples(sid):
    with _connect() as c: rows=c.execute("SELECT payload_json FROM telemetry WHERE session_id=? ORDER BY id",(sid,)).fetchall()
    return [json.loads(r[0]) for r in rows]
def trainee_samples(tid,limit=500):
    with _connect() as c: rows=c.execute("SELECT payload_json FROM telemetry WHERE trainee_id=? ORDER BY id DESC LIMIT ?",(tid,limit)).fetchall()
    return [json.loads(r[0]) for r in reversed(rows)]
def save_profile(tid,count,profile):
    with _connect() as c: c.execute("INSERT INTO profiles VALUES(?,?,?,?) ON CONFLICT(trainee_id) DO UPDATE SET sample_count=excluded.sample_count,profile_json=excluded.profile_json,updated_at=excluded.updated_at",(tid,count,json.dumps(profile),datetime.now(timezone.utc).isoformat()))
def get_profile(tid):
    with _connect() as c: r=c.execute("SELECT * FROM profiles WHERE trainee_id=?",(tid,)).fetchone()
    if not r:return None
    d=dict(r); d['profile']=json.loads(d.pop('profile_json')); return d
