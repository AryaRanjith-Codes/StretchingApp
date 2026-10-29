from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.get("")
def list_players():
    raise HTTPException(status_code=501, detail="Not implemented — Phase 2")


@router.post("")
def create_player():
    raise HTTPException(status_code=501, detail="Not implemented — Phase 2")


@router.delete("/{player_id}")
def delete_player(player_id: str):
    raise HTTPException(status_code=501, detail="Not implemented — Phase 2")
