import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { UserRepository } from '../repositories/user.repository';
import { generateToken, AuthenticatedRequest } from '../middleware/auth.middleware';
import { UserRole } from '../models/types';

const userRepo = new UserRepository();

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Missing required fields: name, email, and password are required.' });
      return;
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    if (typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters in length.' });
      return;
    }

    const existingUser = userRepo.findByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const assignedRole: UserRole = role === 'admin' ? 'admin' : 'customer';
    const now = new Date().toISOString();

    const newUser = userRepo.create({
      id: `usr-${randomUUID().substring(0, 8)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: assignedRole,
      createdAt: now
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    });

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error during registration.', details: error.message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Both email and password are required.' });
      return;
    }

    const user = userRepo.findByEmail(email);
    if (!user || !user.password) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error during authentication.', details: error.message });
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const user = userRepo.findById(req.user.userId);
  if (!user) {
    res.status(404).json({ error: 'User profile not found.' });
    return;
  }

  res.status(200).json({ user });
}
