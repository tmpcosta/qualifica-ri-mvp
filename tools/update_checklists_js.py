"""Gera data/checklists.js a partir de data/checklists.json."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JSON_PATH = ROOT / "data" / "checklists.json"
JS_PATH = ROOT / "data" / "checklists.js"

BANNER = "// Carregado automaticamente a partir de data/checklists.json\n"
GLOBAL_NAME = "window.__QUALIFICA_CHECKLISTS__"


def main() -> None:
    if not JSON_PATH.exists():
        raise SystemExit(f"Arquivo JSON não encontrado: {JSON_PATH}")

    with JSON_PATH.open("r", encoding="utf-8") as fh:
        payload = json.load(fh)

    JS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with JS_PATH.open("w", encoding="utf-8") as fh:
        fh.write(BANNER)
        fh.write(f"{GLOBAL_NAME} = ")
        json.dump(payload, fh, ensure_ascii=False, indent=2)
        fh.write(";\n")

    print(f"Arquivo atualizado: {JS_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
  main()
