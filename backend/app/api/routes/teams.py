from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.get("")
def list_teams():
    raise HTTPException(status_code=501, detail="Not implemented — Phase 2")


@router.post("")
def create_team():
    raise HTTPException(status_code=501, detail="Not implemented — Phase 2")


@router.get("/{team_id}")
def get_team(team_id: str):
    raise HTTPException(status_code=501, detail="Not implemented — Phase 2")
