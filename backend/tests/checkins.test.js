import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { supabaseAuthClient } from '../src/config/supabase.js';
import * as supabaseConfig from '../src/config/supabase.js';

describe('Checkins Endpoints', () => {
  const validToken = 'valid-jwt-token-123';
  const mockUser = {
    id: 'user-uuid-1111',
    email: 'user@example.com',
    user_metadata: { name: 'User One' },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication Requirement', () => {
    it('returns 401 when Authorization header is missing', async () => {
      const res = await request(app).get('/api/checkins');
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/token required/i);
    });

    it('returns 401 when token is invalid', async () => {
      vi.spyOn(supabaseAuthClient.auth, 'getUser').mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid token' },
      });

      const res = await request(app)
        .get('/api/checkins')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/Invalid or expired/i);
    });
  });

  describe('Validation Rules', () => {
    beforeEach(() => {
      vi.spyOn(supabaseAuthClient.auth, 'getUser').mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
    });

    it('rejects mood 0 with 400', async () => {
      const res = await request(app)
        .post('/api/checkins')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ mood: 0, note: 'Too low' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Mood must be between 1 and 5/i);
    });

    it('rejects mood 6 with 400', async () => {
      const res = await request(app)
        .post('/api/checkins')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ mood: 6, note: 'Too high' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Mood must be between 1 and 5/i);
    });

    it('rejects note exceeding 200 characters with 400', async () => {
      const longNote = 'a'.repeat(201);
      const res = await request(app)
        .post('/api/checkins')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ mood: 3, note: longNote });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Note must not exceed 200 characters/i);
    });
  });

  describe('CRUD operations & Ownership', () => {
    beforeEach(() => {
      vi.spyOn(supabaseAuthClient.auth, 'getUser').mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
    });

    it('returns 200 and array on GET /api/checkins', async () => {
      const mockRows = [
        {
          id: '11111111-1111-1111-1111-111111111111',
          mood: 4,
          note: 'Feeling peaceful',
          tag: 'Walk',
          created_at: new Date().toISOString(),
        },
      ];

      // Setup chainable mock query
      const queryMock = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockRows, error: null }),
      };

      vi.spyOn(supabaseConfig, 'createPerRequestSupabaseClient').mockReturnValue({
        from: vi.fn().mockReturnValue(queryMock),
      });

      const res = await request(app)
        .get('/api/checkins')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].mood).toBe(4);
      expect(res.body[0].note).toBe('Feeling peaceful');
      // Ensure user_id is never leaked in the response shape
      expect(res.body[0].user_id).toBeUndefined();
    });

    it('returns 201 on successful check-in creation', async () => {
      const createdRow = {
        id: '22222222-2222-2222-2222-222222222222',
        mood: 5,
        note: 'Had a wonderful day',
        tag: 'Friends',
        created_at: new Date().toISOString(),
      };

      const insertMock = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: createdRow, error: null }),
      };

      vi.spyOn(supabaseConfig, 'createPerRequestSupabaseClient').mockReturnValue({
        from: vi.fn().mockReturnValue(insertMock),
      });

      const res = await request(app)
        .post('/api/checkins')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ mood: 5, note: 'Had a wonderful day', tag: 'Friends' });

      expect(res.status).toBe(201);
      expect(res.body.mood).toBe(5);
      expect(res.body.tag).toBe('Friends');
      expect(res.body.user_id).toBeUndefined();
    });

    it('returns 404 when deleting someone else\'s or non-existent check-in', async () => {
      const deleteMock = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: [], error: null }), // empty array means no matching row found for this user
      };

      vi.spyOn(supabaseConfig, 'createPerRequestSupabaseClient').mockReturnValue({
        from: vi.fn().mockReturnValue(deleteMock),
      });

      const foreignId = '99999999-9999-9999-9999-999999999999';
      const res = await request(app)
        .delete(`/api/checkins/${foreignId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Check-in not found');
    });

    it('returns 204 when successfully deleting an owned check-in', async () => {
      const ownId = '33333333-3333-3333-3333-333333333333';
      const deleteMock = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: [{ id: ownId }], error: null }),
      };

      vi.spyOn(supabaseConfig, 'createPerRequestSupabaseClient').mockReturnValue({
        from: vi.fn().mockReturnValue(deleteMock),
      });

      const res = await request(app)
        .delete(`/api/checkins/${ownId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(204);
    });
  });
});

