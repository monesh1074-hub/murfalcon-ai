-- ==============================================================================
-- MURF FALCON INTERVIEWER - SUPABASE ROW LEVEL SECURITY (RLS) LOCKDOWN SCRIPT
-- ==============================================================================
-- Run this directly in your Supabase SQL Editor to enforce strict data isolation
-- across all public tables using auth.uid() context references.
-- ==============================================================================

-- 1. Enable RLS explicitly on all sensitive application tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_qa ENABLE ROW LEVEL SECURITY;
ALTER TABLE murf_voice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- 2. Restrict "users" table
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid()::text = id::text);

-- 3. Restrict "interview_sessions" (Core tracking table)
CREATE POLICY "Users can view own sessions" 
ON interview_sessions FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own sessions" 
ON interview_sessions FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own sessions" 
ON interview_sessions FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own sessions" 
ON interview_sessions FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- 4. Restrict "interview_qa" (Child reference security structure)
-- Requires recursive lookup since QA only binds to session_id natively
CREATE POLICY "Users can view own qa" 
ON interview_qa FOR SELECT 
USING (
  session_id IN (
    SELECT id FROM interview_sessions WHERE user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Users can insert own qa" 
ON interview_qa FOR INSERT 
WITH CHECK (
  session_id IN (
    SELECT id FROM interview_sessions WHERE user_id::text = auth.uid()::text
  )
);

-- 5. Restrict "murf_voice_logs" (Telemetry table)
CREATE POLICY "Users can view own logs" 
ON murf_voice_logs FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own logs" 
ON murf_voice_logs FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- 6. Restrict "login_history" (Auth tracking)
CREATE POLICY "Users can view own login history" 
ON login_history FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own login history" 
ON login_history FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- ==============================================================================
-- NOTE: If accessing records directly from a Node/Express backend utilizing the 
-- Postgres service_role or 'postgres' user, RLS is natively bypassed to allow
-- administrative inserts. Security on the backend is achieved simultaneously 
-- via parameterized "WHERE user_id = $x" clauses implemented at the API layer.
-- ==============================================================================
