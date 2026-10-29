from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from uuid import UUID


class CoachBase(BaseModel):
    email: EmailStr
    full_name: str


class CoachCreate(CoachBase):
    password: str = Field(min_length=8)


class Coach(CoachBase):
    id: UUID
    created_at: datetime


class TeamBase(BaseModel):
    name: str
    age_group: Optional[str] = None
    season: Optional[str] = None


class TeamCreate(TeamBase):
    pass


class Team(TeamBase):
    id: UUID
    coach_id: UUID
    created_at: datetime


class PlayerBase(BaseModel):
    full_name: str
    jersey_number: Optional[int] = None
    birth_year: Optional[int] = None


class PlayerCreate(PlayerBase):
    team_id: UUID


class Player(PlayerBase):
    id: UUID
    team_id: UUID
    created_at: datetime


class WarmupProgram(BaseModel):
    id: UUID
    code: str  # "fifa_11_plus" | "nordic_hamstring"
    name: str
    description: Optional[str] = None


class SessionCreate(BaseModel):
    team_id: UUID
    program_id: UUID
    session_date: date
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None


class Session(SessionCreate):
    id: UUID
    coach_id: UUID
    created_at: datetime


class AttendanceRecord(BaseModel):
    player_id: UUID
    completed: bool
    partial_notes: Optional[str] = None


class SessionAttendanceCreate(BaseModel):
    session_id: UUID
    records: list[AttendanceRecord]


class ComplianceSummary(BaseModel):
    player_id: UUID
    player_name: str
    sessions_eligible: int
    sessions_completed: int
    compliance_pct: float
