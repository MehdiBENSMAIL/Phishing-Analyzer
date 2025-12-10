#!/bin/bash
cd "$(dirname "$0")"
./venv/bin/uvicorn api:app --reload --port 8000
