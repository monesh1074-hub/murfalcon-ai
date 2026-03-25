import { pool } from '../config/db.js';

// POST /api/interview/start
export async function startSession(req, res, next) {
  try {
    const { roleType, language } = req.body;
    const userId = req.user.id;

const { rows: [result] } = await pool.query(
  'INSERT INTO interview_sessions (user_id, role_type, language) VALUES ($1, $2, $3) RETURNING id',
  [userId, roleType, language || 'en']
)

    res.status(201).json({
      success: true,
      data: {
        sessionId: result.insertId,
        roleType,
        language,
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/interview/answer
export async function saveAnswer(req, res, next) {
  try {
    const { sessionId, questionIndex, questionText, answerText, confidenceScore } = req.body;

    await pool.execute(
      'INSERT INTO interview_qa (session_id, question_index, question_text, answer_text, confidence_score) VALUES (?, ?, ?, ?, ?)',
      [sessionId, questionIndex, questionText, answerText, confidenceScore || 0]
    );

    res.json({
      success: true,
      message: 'Answer saved.',
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/interview/complete
export async function completeSession(req, res, next) {
  try {
    const { sessionId, overallScore, confidenceScore, clarityScore, technicalScore } = req.body;

    await pool.execute(
      `UPDATE interview_sessions 
       SET status = 'completed', 
           overall_score = ?, 
           confidence_score = ?, 
           clarity_score = ?, 
           technical_score = ?,
           completed_at = NOW() 
       WHERE id = ? AND user_id = ?`,
      [overallScore, confidenceScore, clarityScore, technicalScore, sessionId, req.user.id]
    );

    res.json({
      success: true,
      message: 'Interview completed!',
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/interview/history
export async function getHistory(req, res, next) {
  try {
    const userId = req.user.id;

    const { rows: sessions } = await pool.query(
      `SELECT id, role_type, language, overall_score, confidence_score, 
              clarity_score, technical_score, status, started_at, completed_at
       FROM interview_sessions 
       WHERE user_id = $1 
       ORDER BY started_at DESC 
       LIMIT 20`,
      [userId]
    );

    res.json({
      success: true,
      data: { sessions },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/interview/:sessionId/details
export async function getSessionDetails(req, res, next) {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Get session
    const { rows: sessions } = await pool.query(
      'SELECT * FROM interview_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId]
    );

    if (sessions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.',
      });
    }

    // Get Q&A
    const { rows: qaList } = await pool.query(
      'SELECT * FROM interview_qa WHERE session_id = $1 ORDER BY question_index',
      [sessionId]
    );

    res.json({
      success: true,
      data: {
        session: sessions[0],
        questions: qaList,
      },
    });
  } catch (error) {
    next(error);
  }
}