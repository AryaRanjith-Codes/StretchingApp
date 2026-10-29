from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.routes import health, auth, teams, players, warmups, sessions

settings = get_settings()

app = FastAPI(
    title="WarmUp Coach API",
    version="0.1.0",
    description="Backend API for tracking FIFA 11+ and Nordic hamstring compliance.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(teams.router, prefix="/api/teams", tags=["teams"])
app.include_router(players.router, prefix="/api/players", tags=["players"])
app.include_router(warmups.router, prefix="/api/warmups", tags=["warmups"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["sessions"])


@app.get("/")
def root():
    return {"service": "WarmUp Coach API", "status": "ok"}
