Python conventions

- Target Python 3.13 (see backend/pyproject.toml).
- Use the src/ layout; backend package lives in backend/src/backend/.
- Keep changes minimal and explicit; avoid adding dependencies unless asked.
- Prefer the standard library; add third-party libs only when necessary.
- Add type hints to public functions and exported module interfaces.
- If building an HTTP API, default to FastAPI unless asked otherwise.
- Add or update tests when behavior changes; prefer pytest.
- Use structured logging and avoid printing in production code.
- Use uv and the project .venv for installs, runs, and tooling; avoid global Python/pip.
