import os

# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SkillSync API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Init Supabase ──────────────────────────────────────────────
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

supabase: Client | None = None
if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ── Init Groq ──────────────────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")


# ── Pydantic Models ────────────────────────────────────────────
class GenerateTestRequest(BaseModel):
    sector: str
    problem_description: str
    difficulty: Optional[str] = "Medium"
    num_questions: Optional[int] = 5

class SubmissionEval(BaseModel):
    code: str
    language: str = "python"
    test_cases: Optional[list] = []

class RecommendationRequest(BaseModel):
    user_skills: list[str]
    performance_score: int
    sector: str

class IntegrityReport(BaseModel):
    applicant_id: str
    challenge_id: str
    warnings: int
    events: list

class FutureProofRequest(BaseModel):
    sector: str
    tech_stack: str
    business_challenge: str

# ── Fallback MCQ bank (Aptitude & Blood Relations) ────────────────
FALLBACK_QUESTIONS = {
    "web_dev": [
        {"id": 1, "question": "Pointing to a photograph, a man said, 'I have no brother, and that man's father is my father's son.' Whose photograph was it?", "options": ["His son", "His own", "His father", "His nephew"], "correct": 0},
        {"id": 2, "question": "A is the mother of B and C. If D is the husband of C, what is A to D?", "options": ["Mother", "Sister", "Aunt", "Mother-in-law"], "correct": 3},
        {"id": 3, "question": "If 'A + B' means A is the brother of B; 'A x B' means A is the father of B. Which of the following means C is the son of M?", "options": ["M x N + C", "F x C + N", "N + M x C", "M x C + N"], "correct": 3},
        {"id": 4, "question": "Look at this series: 2, 1, (1/2), (1/4)... What number should come next?", "options": ["(1/3)", "(1/8)", "(2/8)", "(1/16)"], "correct": 1},
        {"id": 5, "question": "SCD, TEF, UGH, ____, WKL", "options": ["CMN", "UJI", "VIJ", "IJT"], "correct": 2},
    ],
    "data_ai": [
        {"id": 1, "question": "Introducing a boy, a girl said, 'He is the son of the daughter of the father of my uncle.' How is the boy related to the girl?", "options": ["Brother", "Nephew", "Uncle", "Son-in-law"], "correct": 0},
        {"id": 2, "question": "Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?", "options": ["7", "10", "12", "13"], "correct": 1},
        {"id": 3, "question": "If South-East becomes North, North-East becomes West and so on. What will West become?", "options": ["North-East", "North-West", "South-East", "South-West"], "correct": 2},
        {"id": 4, "question": "A man walks 5 km toward south and then turns to the right. After walking 3 km he turns to the left and walks 5 km. Now in which direction is he from the starting place?", "options": ["West", "South", "North-East", "South-West"], "correct": 3},
        {"id": 5, "question": "QAR, RAS, SAT, TAU, _____", "options": ["UAV", "UAT", "TAS", "TAT"], "correct": 0},
    ],
    "cloud_devops": [
        {"id": 1, "question": "Pointing to a photograph, a woman says, 'This man's son's sister is my mother-in-law.' How is the woman's husband related to the man in the photograph?", "options": ["Grandson", "Son", "Nephew", "Son-in-law"], "correct": 0},
        {"id": 2, "question": "FAG, GAF, HAI, IAH, _____", "options": ["JAK", "HAL", "HAK", "JAI"], "correct": 0},
        {"id": 3, "question": "Which word does not belong with the others?", "options": ["Tulip", "Rose", "Bud", "Daisy"], "correct": 2},
        {"id": 4, "question": "Odometer is to mileage as compass is to:", "options": ["Speed", "Hiking", "Needle", "Direction"], "correct": 3},
        {"id": 5, "question": "If A is the brother of B; B is the sister of C; and C is the father of D, how D is related to A?", "options": ["Brother", "Sister", "Nephew", "Cannot be determined"], "correct": 3},
    ],
    "cybersecurity": [
        {"id": 1, "question": "A is B's sister. C is B's mother. D is C's father. E is D's mother. Then, how is A related to D?", "options": ["Grandfather", "Grandmother", "Daughter", "Granddaughter"], "correct": 3},
        {"id": 2, "question": "Look at this series: 36, 34, 30, 28, 24, ... What number should come next?", "options": ["20", "22", "23", "26"], "correct": 1},
        {"id": 3, "question": "Which word does not belong with the others?", "options": ["Index", "Glossary", "Chapter", "Book"], "correct": 3},
        {"id": 4, "question": "Marathon is to race as hibernation is to:", "options": ["Winter", "Bear", "Dream", "Sleep"], "correct": 3},
        {"id": 5, "question": "A man said to a lady, 'Your mother's husband's sister is my aunt.' How is the lady related to the man?", "options": ["Daughter", "Granddaughter", "Mother", "Sister"], "correct": 3},
    ],
    "mobile_dev": [
        {"id": 1, "question": "A girl introduced a boy as the son of the daughter of the father of her uncle. The boy is girl's:", "options": ["Brother", "Son", "Uncle", "Son-in-law"], "correct": 0},
        {"id": 2, "question": "CMM, EOO, GQQ, _____, KUU", "options": ["GRR", "GSS", "ISS", "ITT"], "correct": 2},
        {"id": 3, "question": "Look at this series: 22, 21, 23, 22, 24, 23, ... What number should come next?", "options": ["22", "24", "25", "26"], "correct": 2},
        {"id": 4, "question": "Yard is to inch as quart is to:", "options": ["Gallon", "Ounce", "Milk", "Liquid"], "correct": 1},
        {"id": 5, "question": "Pointing to a man in a photograph, a woman said, 'His brother's father is the only son of my grandfather.' How is the woman related to the man?", "options": ["Mother", "Aunt", "Sister", "Daughter"], "correct": 2},
    ],
}


# ── Endpoints ──────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "SkillSync API v2.0", "status": "running"}


@app.post("/api/generate-test")
async def generate_test(req: GenerateTestRequest):
    """Generate a challenge using Groq API (serving as Grok)."""
    if GROQ_API_KEY:
        try:
            prompt = f"""
You are creating a skills assessment for a {req.sector} role at difficulty: {req.difficulty}.
Problem context: {req.problem_description}

Generate a JSON response with:
1. "title": A short challenge title (max 10 words)
2. "round1_questions": Array of {req.num_questions} MCQ objects focused on aptitude, logical reasoning, and blood relations (NOT coding questions). Keys: id, question, options (4 choices), correct (0-indexed integer)
3. "round2_problem": A LeetCode-style coding problem description (2-3 sentences)
4. "round3_scenario": A real-world industry scenario (3-4 sentences)

Return ONLY valid JSON, no markdown formatting or backticks.
"""
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {GROQ_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "llama3-8b-8192",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.7
                    }
                )
                resp.raise_for_status()
                data = resp.json()
                text = data["choices"][0]["message"]["content"].strip()
                import json
                if text.startswith("```"):
                    text = text.split("```")[1]
                    if text.startswith("json"):
                        text = text[4:]
                return json.loads(text.strip())
        except Exception as e:
            print(f"Groq error: {e}")

    # Fallback
    sector_key = req.sector if req.sector in FALLBACK_QUESTIONS else "web_dev"
    return {
        "title": f"{req.sector.replace('_', ' ').title()} Skills Assessment",
        "round1_questions": FALLBACK_QUESTIONS[sector_key],
        "round2_problem": f"Implement a solution for: {req.problem_description}. Handle edge cases and follow best practices.",
        "round3_scenario": f"You've joined a team working on: {req.problem_description}. Describe your approach, architecture decisions, and potential pitfalls.",
    }


@app.post("/api/evaluate-code")
async def evaluate_code(req: SubmissionEval):
    """Proxy to Piston API for code execution."""
    import httpx
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                "https://emkc.org/api/v2/piston/execute",
                json={
                    "language": req.language,
                    "version": "*",
                    "files": [{"content": req.code}],
                }
            )
            result = resp.json()
            stdout = result.get("run", {}).get("stdout", "").strip()
            stderr = result.get("run", {}).get("stderr", "").strip()
            return {"stdout": stdout, "stderr": stderr, "success": not stderr}
    except Exception as e:
        return {"stdout": "", "stderr": str(e), "success": False}


@app.post("/api/recommendation")
async def get_recommendation(req: RecommendationRequest):
    """AI-powered career recommendation via Groq."""
    if not GROQ_API_KEY:
        return {"recommendation": f"Focus on deepening your {req.sector} expertise. With a score of {req.performance_score}/100, consider practicing system design patterns and contributing to open-source projects. (Set GROQ_API_KEY for AI-powered recommendations)"}

    prompt = f"""
Act as a Principal Engineer. A candidate has:
- Skills: {', '.join(req.user_skills)}
- Score: {req.performance_score}/100
- Sector: {req.sector}

Provide a 2-3 sentence highly actionable career recommendation. Be specific and direct.
"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama3-8b-8192",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.7
                }
            )
            resp.raise_for_status()
            data = resp.json()
            return {"recommendation": data["choices"][0]["message"]["content"].strip()}
    except Exception as e:
        print(f"Groq error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch recommendation")


@app.post("/api/integrity-report")
async def integrity_report(req: IntegrityReport):
    """Store integrity violations in Supabase."""
    if supabase:
        try:
            supabase.table("submissions").update({
                "integrity_warnings": req.warnings,
                "integrity_events": req.events,
                "status": "disqualified" if req.warnings >= 3 else None,
            }).eq("applicant_id", req.applicant_id).eq("challenge_id", req.challenge_id).execute()
        except Exception as e:
            print(f"Supabase error: {e}")

    severity = "critical" if req.warnings >= 3 else "warning" if req.warnings > 0 else "clean"
    return {"status": severity, "warnings": req.warnings, "message": f"Integrity report processed. {req.warnings} violation(s) recorded."}


@app.post("/api/future-proof-strategy")
async def future_proof_strategy(req: FutureProofRequest):
    """Generate a Future-Proof strategic blueprint using Groq."""
    if GROQ_API_KEY:
        try:
            prompt = f"""
Act as a Principal Innovation Strategist.
Company Sector: {req.sector}
Current Stack: {req.tech_stack}
Business Challenge: {req.business_challenge}

Provide a concise, 3-point strategic blueprint for how this organization can future-proof itself and remain relevant.
Keep it extremely brief to save tokens (under 100 words total). Focus on actionable innovation.
Format as bullet points.
"""
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {GROQ_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "llama3-8b-8192",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.7
                    }
                )
                resp.raise_for_status()
                data = resp.json()
                return {"strategy": data["choices"][0]["message"]["content"].strip()}
        except Exception as e:
            print(f"Groq error: {e}")
            
    # Hardcoded fallback if API fails or exhausted
    return {
        "strategy": "• Modernize Legacy Architecture: Migrate core services to microservices to improve agility.\n• Upskill Workforce: Invest heavily in continuous AI-literacy training for your engineering teams.\n• Adopt Emerging Tech: Evaluate specialized open-source tools within your stack to reduce dependency lock-in."
    }


@app.get("/api/challenges")
async def list_challenges(sector: str = None, difficulty: str = None):
    """Fetch challenges from Supabase."""
    if not supabase:
        from fastapi.responses import JSONResponse
        return JSONResponse({"message": "Supabase not connected", "challenges": []})

    query = supabase.table("challenges").select("*").eq("is_active", True)
    if sector:
        query = query.eq("sector", sector)
    if difficulty:
        query = query.eq("difficulty", difficulty)

    result = query.execute()
    return result.data


@app.get("/api/leaderboard")
async def get_leaderboard(limit: int = 20, sector: str = None):
    """Fetch leaderboard from Supabase view."""
    if not supabase:
        return []
    query = supabase.table("leaderboard").select("*").limit(limit)
    if sector:
        query = query.eq("sector", sector)
    result = query.execute()
    return result.data
