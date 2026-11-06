import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { supabaseAuthClient } from '../src/config/supabase.js';

describe('Auth & Health Endpoints', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/health', () => {
    it('returns status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('POST /api/auth/signup', () => {
    it('rejects missing or short password with 400', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Alex', email: 'alex@example.com', password: 'short' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('rejects invalid email address with 400', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Alex', email: 'not-an-email', password: 'ValidPassword123' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Invalid email/i);
    });

    it('creates user and returns 201 with token when valid', async () => {
      vi.spyOn(supabaseAuthClient.auth, 'signUp').mockResolvedValueOnce({
        data: {
          user: {
            id: 'mock-user-123',
            email: 'newuser@example.com',
            user_metadata: { name: 'New User' },
          },
          session: {
            access_token: 'mock-jwt-token-xyz',
          },
        },
        error: null,
      });

      const res = await request(app).post('/api/auth/signup').send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'SecurePassword123!',
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toEqual({
        id: 'mock-user-123',
        name: 'New User',
        email: 'newuser@example.com',
      });
      expect(res.body.token).toBe('mock-jwt-token-xyz');
    });
  });

  describe('POST /api/auth/login', () => {
    it('returns generic 401 on invalid credentials', async () => {
      vi.spyOn(supabaseAuthClient.auth, 'signInWithPassword').mockResolvedValueOnce({
        data: { session: null, user: null },
        error: { message: 'Invalid login credentials' },
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alex@example.com', password: 'WrongPassword' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid email or password');
    });

    it('returns 200 and token on successful login', async () => {
      vi.spyOn(supabaseAuthClient.auth, 'signInWithPassword').mockResolvedValueOnce({
        data: {
          user: {
            id: 'mock-user-123',
            email: 'alex@example.com',
            user_metadata: { name: 'Alex' },
          },
          session: {
            access_token: 'valid-session-jwt',
          },
        },
        error: null,
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alex@example.com', password: 'CorrectPassword123' });

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('alex@example.com');
      expect(res.body.token).toBe('valid-session-jwt');
    });
  });
});

