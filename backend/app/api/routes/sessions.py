from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.post("")
def log_session():
    raise HTTPException(status_code=501, detail="Not implemented — Phase 3")


@router.get("")
def list_sessions():
    raise HTTPException(status_code=501, detail="Not implemented — Phase 3")


@router.post("/attendance")
def record_attendance():
    raise HTTPException(status_code=501, detail="Not implemented — Phase 3")


@router.get("/compliance/{team_id}")
def compliance_summary(team_id: str):
    raise HTTPException(status_code=501, detail="Not implemented — Phase 4")
