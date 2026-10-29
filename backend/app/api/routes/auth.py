from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.post("/signup")
def signup():
    raise HTTPException(status_code=501, detail="Not implemented — Phase 2")


@router.post("/login")
def login():
    raise HTTPException(status_code=501, detail="Not implemented — Phase 2")


@router.post("/logout")
def logout():
    raise HTTPException(status_code=501, detail="Not implemented — Phase 2")
