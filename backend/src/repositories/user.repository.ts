import { getDatabase } from '../config/database';
import { User } from '../models/types';

export class UserRepository {
  private get db() {
    return getDatabase();
  }

  findByEmail(email: string): User | undefined {
    const stmt = this.db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)');
    return stmt.get(email) as User | undefined;
  }

  findById(id: string): User | undefined {
    const stmt = this.db.prepare('SELECT id, name, email, role, createdAt FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }

  create(user: User): User {
    const stmt = this.db.prepare(`
      INSERT INTO users (id, name, email, password, role, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(user.id, user.name, user.email, user.password, user.role, user.createdAt);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }
}
