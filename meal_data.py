"""Load the shared meal catalog (data/meal_catalog.json)."""
import json
from pathlib import Path

_CATALOG_PATH = Path(__file__).resolve().parent / "data" / "meal_catalog.json"

with open(_CATALOG_PATH, encoding="utf-8") as _fh:
    _CATALOG = json.load(_fh)

MEAL_DATABASE = _CATALOG["diets"]
ALTERNATIVES = _CATALOG.get("alternatives", {})
