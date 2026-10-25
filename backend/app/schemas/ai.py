from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import uuid


class AskAIInput(BaseModel):
    farm_id: Optional[uuid.UUID] = None
    flock_id: Optional[uuid.UUID] = None
    query: str
    language: str = "mr"  # mr, en, hi
    context: Optional[Dict[str, Any]] = None


class AIResponse(BaseModel):
    success: bool
    source: str  # gemini, freellmapi, rule_based
    model: str
    badge: str
    text: str
    disclaimer: str
