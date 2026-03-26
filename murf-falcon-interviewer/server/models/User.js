import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = {
  // Create new user
 async create({ fullName, email, password }) {
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const { rows: [newUser] } = await pool.query(
    'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email',
    [fullName, email, passwordHash]
  );

  return {
    id: newUser.id,
    fullName: newUser.full_name,
    email: newUser.email,
  };
},

  // Find user by email
  async findByEmail(email) {
    const { rows: users } = await pool.query('SELECT * FROM users WHERE email = $1', [email]
    );
    return users[0] || null;
  },

  // Find user by ID
  async findById(id) {
    const { rows: users } = await pool.query(
      'SELECT id, full_name, email, preferred_lang, avatar_url, created_at FROM users WHERE id = $1',
      [id]
    );
    return users[0] || null;
  },

  // Compare password
  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  // Update preferred language
  async updateLanguage(userId, lang) {
   await pool.query('UPDATE users SET preferred_lang = $1 WHERE id = $2', [lang, userId]
    );
  },

  // Log login
  async logLogin(userId, ipAddress, userAgent) {
await pool.query('INSERT INTO login_history (user_id, ip_address, user_agent) VALUES ($1, $2, $3)', [userId, ipAddress, userAgent]
    );
  },
};

export default User;