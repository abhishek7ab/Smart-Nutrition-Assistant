"""SQLite persistence for generated meal plans."""
from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from models import Profile

_DB_PATH = Path(__file__).resolve().parent / "data" / "plans.db"


def _connect() -> sqlite3.Connection:
    _DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with _connect() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                date TEXT,
                kind TEXT NOT NULL,
                profile_json TEXT NOT NULL,
                plan_json TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_plans_user ON plans(user_id, created_at DESC)")
        conn.commit()


def save_plan(profile: Profile, plan: Dict[str, Any], kind: str) -> int:
    init_db()
    created = datetime.now(timezone.utc).isoformat()
    with _connect() as conn:
        cur = conn.execute(
            """
            INSERT INTO plans (user_id, date, kind, profile_json, plan_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                profile.name,
                plan.get("date"),
                kind,
                profile.model_dump_json(),
                json.dumps(plan),
                created,
            ),
        )
        conn.commit()
        return int(cur.lastrowid)


def list_plans(user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
    init_db()
    with _connect() as conn:
        rows = conn.execute(
            """
            SELECT id, user_id, date, kind, plan_json, created_at
            FROM plans
            WHERE lower(user_id) = lower(?)
            ORDER BY id DESC
            LIMIT ?
            """,
            (user_id.strip(), max(1, min(limit, 50))),
        ).fetchall()
    results = []
    for row in rows:
        plan = json.loads(row["plan_json"])
        plan["id"] = row["id"]
        plan["kind"] = row["kind"]
        plan["created_at"] = row["created_at"]
        results.append(plan)
    return results


def get_plan(plan_id: int) -> Optional[Dict[str, Any]]:
    init_db()
    with _connect() as conn:
        row = conn.execute(
            "SELECT id, kind, plan_json, created_at FROM plans WHERE id = ?",
            (plan_id,),
        ).fetchone()
    if not row:
        return None
    plan = json.loads(row["plan_json"])
    plan["id"] = row["id"]
    plan["kind"] = row["kind"]
    plan["created_at"] = row["created_at"]
    return plan
