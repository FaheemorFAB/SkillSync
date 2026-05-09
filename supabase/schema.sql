-- ============================================================
-- SkillSync: FutureProof Platform - Complete Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('applicant', 'company', 'employee')),
  full_name TEXT,
  email TEXT,
  company_name TEXT, -- for company role
  company_id UUID,   -- for employee role (links to company profile)
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  sector TEXT,       -- primary sector of interest/expertise
  website_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CHALLENGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sector TEXT NOT NULL CHECK (sector IN ('web_dev', 'mobile_dev', 'data_ai', 'cloud_devops', 'cybersecurity')),
  sub_sector TEXT,   -- e.g. 'frontend', 'backend', 'fullstack'
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  time_limit_mins INTEGER DEFAULT 60,
  skills_required TEXT[] DEFAULT '{}',
  -- Round 1: AI-generated aptitude test data
  round1_questions JSONB DEFAULT '[]',
  -- Round 2: Technical coding challenge
  round2_problem TEXT,
  round2_starter_code TEXT,
  round2_test_cases JSONB DEFAULT '[]',
  -- Round 3: Industry problem
  round3_scenario TEXT,
  round3_resources JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  applicant_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'disqualified')),
  current_round INTEGER DEFAULT 1,
  round1_score INTEGER DEFAULT 0,
  round2_score INTEGER DEFAULT 0,
  round3_score INTEGER DEFAULT 0,
  total_score INTEGER GENERATED ALWAYS AS (round1_score + round2_score + round3_score) STORED,
  round1_answers JSONB DEFAULT '{}',
  round2_code TEXT,
  round3_response TEXT,
  integrity_warnings INTEGER DEFAULT 0,
  integrity_events JSONB DEFAULT '[]',
  time_taken_mins INTEGER,
  ai_feedback TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(applicant_id, challenge_id)
);

-- ============================================================
-- INTERNAL MATCHES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.internal_matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_score NUMERIC(5,2) DEFAULT 0,
  matched_skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, employee_id)
);

-- ============================================================
-- INTERVIEW ROOMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.interview_rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  room_name TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LEADERBOARD VIEW (derived from submissions)
-- ============================================================
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  s.id AS submission_id,
  s.applicant_id,
  p.full_name,
  p.avatar_url,
  p.skills,
  c.title AS challenge_title,
  c.sector,
  c.difficulty,
  s.total_score,
  s.current_round,
  s.status,
  s.completed_at,
  RANK() OVER (PARTITION BY s.challenge_id ORDER BY s.total_score DESC) AS rank_in_challenge,
  RANK() OVER (ORDER BY s.total_score DESC) AS global_rank
FROM public.submissions s
JOIN public.profiles p ON s.applicant_id = p.id
JOIN public.challenges c ON s.challenge_id = c.id
WHERE s.status = 'completed'
ORDER BY s.total_score DESC;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_rooms ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Challenges policies
CREATE POLICY "Challenges are viewable by everyone" ON public.challenges
  FOR SELECT USING (TRUE);

CREATE POLICY "Companies can create challenges" ON public.challenges
  FOR INSERT WITH CHECK (
    auth.uid() = company_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'company')
  );

CREATE POLICY "Companies can update their own challenges" ON public.challenges
  FOR UPDATE USING (auth.uid() = company_id);

-- Submissions policies
CREATE POLICY "Submissions viewable by owner and company" ON public.submissions
  FOR SELECT USING (
    auth.uid() = applicant_id OR
    EXISTS (
      SELECT 1 FROM public.challenges c
      WHERE c.id = challenge_id AND c.company_id = auth.uid()
    )
  );

CREATE POLICY "Applicants can create submissions" ON public.submissions
  FOR INSERT WITH CHECK (
    auth.uid() = applicant_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'applicant')
  );

CREATE POLICY "Applicants can update their own submissions" ON public.submissions
  FOR UPDATE USING (auth.uid() = applicant_id);

-- Internal matches policies
CREATE POLICY "Internal matches viewable by company" ON public.internal_matches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.challenges c
      WHERE c.id = challenge_id AND c.company_id = auth.uid()
    )
  );

-- Interview rooms policies
CREATE POLICY "Interview rooms viewable by participants" ON public.interview_rooms
  FOR SELECT USING (auth.uid() = company_id OR auth.uid() = applicant_id);

CREATE POLICY "Companies can create interview rooms" ON public.interview_rooms
  FOR INSERT WITH CHECK (auth.uid() = company_id);

CREATE POLICY "Companies can update interview rooms" ON public.interview_rooms
  FOR UPDATE USING (auth.uid() = company_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'applicant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on new auth user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- REALTIME PUBLICATION (for live leaderboard)
-- ============================================================
DROP PUBLICATION IF EXISTS skillsync_realtime;
CREATE PUBLICATION skillsync_realtime FOR TABLE
  public.submissions,
  public.profiles,
  public.challenges;

-- ============================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================

-- Insert sample challenges (will need real company_id from auth)
-- These are seeded as NULL company for demo
INSERT INTO public.challenges (title, description, sector, sub_sector, difficulty, time_limit_mins, skills_required, round1_questions, round2_problem, round2_starter_code, round3_scenario)
VALUES
(
  'Build a Real-Time Dashboard',
  'Design and implement a real-time analytics dashboard using React and WebSockets.',
  'web_dev', 'frontend', 'Hard', 75,
  ARRAY['React', 'WebSockets', 'TypeScript', 'CSS'],
  '[
    {"id":1,"question":"What is the time complexity of binary search?","options":["O(n)","O(log n)","O(n²)","O(1)"],"correct":1},
    {"id":2,"question":"Which CSS property creates a new stacking context?","options":["display","position","z-index","transform"],"correct":3},
    {"id":3,"question":"What does REST stand for?","options":["Remote Execution Standard Technology","Representational State Transfer","Resource Endpoint Structure Template","Reactive Event Streaming Technology"],"correct":1},
    {"id":4,"question":"In React, what hook is used for side effects?","options":["useState","useCallback","useEffect","useMemo"],"correct":2},
    {"id":5,"question":"Which HTTP method is idempotent and safe?","options":["POST","PUT","DELETE","GET"],"correct":3}
  ]',
  'Given an array of integers, return the indices of the two numbers such that they add up to a target. You may assume each input has exactly one solution.',
  'function twoSum(nums, target) {\n  // Your solution here\n}',
  'You''ve been given a production React app that re-renders 60+ times per second causing jank. Debug the performance issue and provide a fix using React DevTools Profiler methodology.'
),
(
  'FastAPI Microservice Architecture',
  'Build a scalable microservice with authentication, rate limiting, and async database operations.',
  'web_dev', 'backend', 'Hard', 90,
  ARRAY['FastAPI', 'Python', 'PostgreSQL', 'Docker'],
  '[
    {"id":1,"question":"What is the default isolation level in PostgreSQL?","options":["Read Uncommitted","Read Committed","Repeatable Read","Serializable"],"correct":1},
    {"id":2,"question":"Which Python keyword makes a function asynchronous?","options":["async","await","yield","defer"],"correct":0},
    {"id":3,"question":"What does ACID stand for in databases?","options":["Atomicity, Consistency, Isolation, Durability","Automated, Consistent, Indexed, Durable","Atomic, Controlled, Integrated, Distributed","Advanced, Complete, Integrated, Data"],"correct":0}
  ]',
  'Implement a rate limiter using the Token Bucket algorithm in Python.',
  'class RateLimiter:\n    def __init__(self, capacity: int, refill_rate: float):\n        # Initialize your rate limiter\n        pass\n    \n    def is_allowed(self, user_id: str) -> bool:\n        # Return True if request is allowed\n        pass',
  'Your company''s API is receiving 10,000 req/sec during a flash sale. The current rate limiter is causing cascading failures. Design a distributed rate limiting solution that handles this load.'
),
(
  'ML Model Deployment Pipeline',
  'Deploy a trained ML model with monitoring, versioning, and A/B testing capabilities.',
  'data_ai', 'machine_learning', 'Medium', 60,
  ARRAY['Python', 'MLflow', 'FastAPI', 'Docker', 'scikit-learn'],
  '[
    {"id":1,"question":"What is overfitting in machine learning?","options":["Model performs well on training but poorly on new data","Model performs poorly on both training and test data","Model is too simple to capture patterns","Model takes too long to train"],"correct":0},
    {"id":2,"question":"What does gradient descent minimize?","options":["The model size","The training data","The loss function","The prediction time"],"correct":2}
  ]',
  'Implement k-means clustering from scratch without using sklearn.',
  'import numpy as np\n\ndef kmeans(X, k, max_iters=100):\n    # Your implementation\n    pass',
  'Your ML model has drifted in production with 15% accuracy drop over 3 months. Design a monitoring and retraining pipeline that automatically detects drift and triggers retraining.'
),
(
  'Kubernetes Security Hardening',
  'Secure a vulnerable Kubernetes deployment following CIS benchmarks.',
  'cloud_devops', 'infrastructure', 'Hard', 90,
  ARRAY['Kubernetes', 'Docker', 'Helm', 'Security', 'YAML'],
  '[
    {"id":1,"question":"What is a Kubernetes Pod?","options":["A virtual machine","The smallest deployable unit","A container registry","A network policy"],"correct":1},
    {"id":2,"question":"Which command shows running pods?","options":["kubectl get pods","kubectl list pods","kubectl show pods","kubectl display pods"],"correct":0}
  ]',
  'Debug this Dockerfile - it has 5 security vulnerabilities.',
  'FROM ubuntu:latest\nRUN apt-get install -y curl\nUSER root\nCOPY . /app\nCMD ["bash", "-c", "cd /app && python app.py"]',
  'A cluster running banking application has failed a PCI-DSS audit. Fix all identified security misconfigurations in the provided Kubernetes manifests.'
),
(
  'Penetration Testing Challenge',
  'Identify and document vulnerabilities in a deliberately vulnerable web application.',
  'cybersecurity', 'penetration_testing', 'Hard', 120,
  ARRAY['Kali Linux', 'Burp Suite', 'OWASP', 'Python', 'Networking'],
  '[
    {"id":1,"question":"What does SQL injection exploit?","options":["Network vulnerabilities","Improper input validation in database queries","Weak password policies","Outdated software versions"],"correct":1},
    {"id":2,"question":"What is XSS?","options":["Cross-Site Scripting","Cross-Service Synchronization","Cross-System Security","Cross-Site Storage"],"correct":0},
    {"id":3,"question":"Which HTTP header prevents clickjacking?","options":["Content-Security-Policy","X-Frame-Options","Strict-Transport-Security","X-XSS-Protection"],"correct":1}
  ]',
  'Write a Python script to detect open ports on a target host.',
  'import socket\n\ndef port_scanner(host: str, ports: list) -> dict:\n    # Your implementation\n    pass',
  'You''ve been hired to audit a fintech startup''s web app. Using only passive reconnaissance and safe testing methods, identify the top 3 OWASP vulnerabilities and provide remediation steps.'
);
