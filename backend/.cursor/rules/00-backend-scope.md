Scope: backend-only

- Apply these rules only inside backend/.
- Avoid editing frontend/ or other packages unless explicitly asked.
- Prefer small, focused changes that keep the src/ layout intact.
- Keep agent config changes scoped to backend/.cursor/ unless asked.
- Use uv and the project .venv for all Python dependency changes and commands.
