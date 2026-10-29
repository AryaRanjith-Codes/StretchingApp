from fastapi import APIRouter

router = APIRouter()


@router.get("/programs")
def list_programs():
    """Return the catalog of warm-up programs (FIFA 11+, Nordic HE)."""
    return {
        "programs": [
            {
                "code": "fifa_11_plus",
                "name": "FIFA 11+",
                "duration_minutes": 20,
                "frequency_per_week": 2,
                "parts": ["Running (~8m)", "Strength/plyo/balance (~10m)", "Running (~2m)"],
            },
            {
                "code": "nordic_hamstring",
                "name": "Nordic Hamstring Exercise",
                "duration_minutes": 5,
                "frequency_per_week": 2,
                "parts": ["Eccentric kneeling fall-and-catch"],
            },
        ]
    }
