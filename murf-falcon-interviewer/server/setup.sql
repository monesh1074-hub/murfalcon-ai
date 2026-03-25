-- Supabase PostgreSQL Setup Schema
-- Execute this within your Supabase SQL Editor to enforce rigorous relational tracking for Falcon Telemetry.

CREATE TABLE IF NOT EXISTS interview_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    role_type VARCHAR(255) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    overall_score INTEGER DEFAULT 0,
    confidence_score DECIMAL(4,2) DEFAULT 0,
    clarity_score DECIMAL(4,2) DEFAULT 0,
    technical_score DECIMAL(4,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'started',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS interview_qa (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_index INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    confidence_score DECIMAL(4,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS murf_voice_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    session_id INTEGER REFERENCES interview_sessions(id) ON DELETE CASCADE,
    input_text TEXT NOT NULL,
    voice_id VARCHAR(255) NOT NULL,
    audio_url TEXT,
    latency_ms INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
