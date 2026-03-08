import { validateCalendarQuery, validateCalendarCreation, validateCalendarUpdate} from '@/api/calendar/calendar.validation';

describe('Calendar Validation', () => {
  describe('validateCalendarQuery', () => {
    it('should return no errors for valid date strings', () => {
      const query = {
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-12-31T23:59:59.999Z'
      };
      const errors = validateCalendarQuery(query);
      expect(errors).toHaveLength(0);
    });

    it('should return no errors for empty query', () => {
      const errors = validateCalendarQuery({});
      expect(errors).toHaveLength(0);
    });

    it('should validate ISO date format', () => {
      const query = {
        start: 'invalid-date',
        end: 'not-a-date-at-all'
      };
      const errors = validateCalendarQuery(query);
      expect(errors).toContainEqual({
        field: 'start',
        message: 'start must be a valid ISO date string'
      });
      expect(errors).toContainEqual({
        field: 'end',
        message: 'end must be a valid ISO date string'
      });
    });

    it('should reject non-string values', () => {
      const query = {
        start: 12345 as any,
        end: null as any
      };
      const errors = validateCalendarQuery(query);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateCalendarCreation', () => {
    const validInput = {
      title: 'Study Session',
      start_utc: '2024-01-15T10:00:00.000Z',
      end_utc: '2024-01-15T11:00:00.000Z'
    };

    it('should return no errors for valid input', () => {
      const errors = validateCalendarCreation(validInput);
      expect(errors).toHaveLength(0);
    });

    it('should validate title minimum length', () => {
      const input = { ...validInput, title: 'Hi' };
      const errors = validateCalendarCreation(input);
      expect(errors).toContainEqual({
        field: 'title',
        message: 'title is required and must be at least 3 characters'
      });
    });

    it('should reject empty title', () => {
      const input = { ...validInput, title: '' };
      const errors = validateCalendarCreation(input);
      expect(errors.some(e => e.field === 'title')).toBe(true);
    });

    it('should validate start_utc is required', () => {
      const input = { ...validInput, start_utc: undefined };
      const errors = validateCalendarCreation(input);
      expect(errors).toContainEqual({
        field: 'start_utc',
        message: 'start_utc must be a valid ISO date string'
      });
    });

    it('should validate end_utc is after start_utc', () => {
      const input = {
        ...validInput,
        start_utc: '2024-01-15T11:00:00.000Z',
        end_utc: '2024-01-15T10:00:00.000Z'
      };
      const errors = validateCalendarCreation(input);
      expect(errors).toContainEqual({
        field: 'end_utc',
        message: 'end_utc must be after start_utc'
      });
    });

    it('should allow equal dates if logic permits', () => {
      const timestamp = '2024-01-15T10:00:00.000Z';
      const input = { ...validInput, start_utc: timestamp, end_utc: timestamp };
      const errors = validateCalendarCreation(input);
      // This should pass or fail based on the implementation
      // The current implementation only checks start > end, so equal is allowed
      expect(errors.some(e => e.field === 'end_utc')).toBe(false);
    });
  });

  describe('validateCalendarUpdate', () => {
    const validUpdate = {
      title: 'Updated Session',
      start_utc: '2024-01-15T12:00:00.000Z',
      end_utc: '2024-01-15T13:00:00.000Z'
    };

    it('should return no errors for valid update', () => {
      const errors = validateCalendarUpdate(validUpdate);
      expect(errors).toHaveLength(0);
    });

    it('should allow partial updates', () => {
      const errors = validateCalendarUpdate({});
      expect(errors).toHaveLength(0);
    });

    it('should validate title if provided', () => {
      const input = { title: 'Hi' };
      const errors = validateCalendarUpdate(input);
      expect(errors).toContainEqual({
        field: 'title',
        message: 'title must be at least 3 characters if provided'
      });
    });

    it('should validate date logic for updates', () => {
      const input = {
        start_utc: '2024-01-15T13:00:00.000Z',
        end_utc: '2024-01-15T12:00:00.000Z'
      };
      const errors = validateCalendarUpdate(input);
      expect(errors).toContainEqual({
        field: 'end_utc',
        message: 'end_utc must be after start_utc'
      });
    });
  });
});