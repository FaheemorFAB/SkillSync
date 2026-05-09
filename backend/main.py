import os

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

# ── Fallback MCQ bank ─────────────────────────────────────────
FALLBACK_QUESTIONS = {
    "web_dev": [
        {"id": 1, "question": "What is the time complexity of binary search?", "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"], "correct": 1},
        {"id": 2, "question": "Which CSS property creates a new stacking context?", "options": ["display", "position", "z-index", "transform"], "correct": 3},
        {"id": 3, "question": "In React, what hook is used for side effects?", "options": ["useState", "useCallback", "useEffect", "useMemo"], "correct": 2},
        {"id": 4, "question": "What does REST stand for?", "options": ["Remote Exec", "Representational State Transfer", "Resource Template", "Reactive Streaming"], "correct": 1},
        {"id": 5, "question": "Which HTTP method is idempotent and safe?", "options": ["POST", "PUT", "DELETE", "GET"], "correct": 3},
    ],
    "data_ai": [
        {"id": 1, "question": "What is overfitting in ML?", "options": ["Good generalisation", "High train/low test performance", "Slow training", "Too much data"], "correct": 1},
        {"id": 2, "question": "What does gradient descent minimize?", "options": ["Model size", "Training data", "Loss function", "Prediction time"], "correct": 2},
        {"id": 3, "question": "What is a confusion matrix used for?", "options": ["Visualising neural nets", "Evaluating classification models", "Data preprocessing", "Feature selection"], "correct": 1},
        {"id": 4, "question": "What does 'epochs' mean in training?", "options": ["Data batches", "Full passes through dataset", "Learning rate steps", "Activation cycles"], "correct": 1},
        {"id": 5, "question": "Which algorithm is best for non-linear decision boundaries?", "options": ["Linear Regression", "Logistic Regression", "Decision Tree", "K-Means"], "correct": 2},
    ],
    "cloud_devops": [
        {"id": 1, "question": "What is a Kubernetes Pod?", "options": ["Virtual machine", "Smallest deployable unit", "Container registry", "Network policy"], "correct": 1},
        {"id": 2, "question": "IaC stands for?", "options": ["Integration as Code", "Infrastructure as Code", "Interface as Component", "Internal as Core"], "correct": 1},
        {"id": 3, "question": "Docker layers are?", "options": ["Mutable", "Immutable", "Optional", "Encrypted"], "correct": 1},
        {"id": 4, "question": "Which command builds a Docker image?", "options": ["docker run", "docker build", "docker create", "docker start"], "correct": 1},
        {"id": 5, "question": "What is a Helm chart?", "options": ["K8s network plugin", "Package manager template for K8s", "Docker compose file", "CI/CD pipeline"], "correct": 1},
    ],
    "cybersecurity": [
        {"id": 1, "question": "SQL injection exploits?", "options": ["Network vulnerabilities", "Improper input validation", "Weak passwords", "Outdated software"], "correct": 1},
        {"id": 2, "question": "XSS stands for?", "options": ["Cross-Site Scripting", "Cross-Service Sync", "Cross-System Security", "Cross-Site Storage"], "correct": 0},
        {"id": 3, "question": "Which header prevents clickjacking?", "options": ["Content-Security-Policy", "X-Frame-Options", "Strict-Transport-Security", "X-XSS-Protection"], "correct": 1},
        {"id": 4, "question": "OWASP stands for?", "options": ["Open Web Application Security Project", "Online Web Auth Standard Protocol", "Open Wireless App Security Platform", "None"], "correct": 0},
        {"id": 5, "question": "A man-in-the-middle attack intercepts?", "options": ["Server logs", "Database queries", "Communications between parties", "File system"], "correct": 2},
    ],
    "mobile_dev": [
        {"id": 1, "question": "Flutter is built with which language?", "options": ["Kotlin", "Dart", "Swift", "JavaScript"], "correct": 1},
        {"id": 2, "question": "React Native renders using?", "options": ["WebView", "Native components", "HTML/CSS", "Canvas"], "correct": 1},
        {"id": 3, "question": "What is a StatefulWidget in Flutter?", "options": ["Immutable widget", "Widget with mutable state", "Network widget", "Animated widget"], "correct": 1},
        {"id": 4, "question": "APK files are for?", "options": ["iOS", "Android", "Web", "Desktop"], "correct": 1},
        {"id": 5, "question": "Xcode is used for?", "options": ["Android apps", "iOS/macOS apps", "Cross-platform apps", "Backend services"], "correct": 1},
    ],
}


# ── Endpoints ──────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "SkillSync API v2.0", "status": "running"}


@app.post("/api/generate-test")
async def generate_test(req: GenerateTestRequest):
    """Generate a challenge using Gemini 2.5 Flash or fallback to hardcoded."""
    if GEMINI_KEY:
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            prompt = f"""
You are creating a skills assessment for a {req.sector} role at difficulty: {req.difficulty}.
Problem context: {req.problem_description}

Generate a JSON response with:
1. "title": A short challenge title (max 10 words)
2. "round1_questions": Array of {req.num_questions} MCQ objects with keys: id, question, options (4 choices), correct (0-indexed)
3. "round2_problem": A LeetCode-style coding problem description (2-3 sentences)
4. "round3_scenario": A real-world industry scenario (3-4 sentences)

Return ONLY valid JSON, no markdown.
"""
            response = model.generate_content(prompt)
            import json
            text = response.text.strip()
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            data = json.loads(text.strip())
            return data
        except Exception as e:
            print(f"Gemini error: {e}")

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
