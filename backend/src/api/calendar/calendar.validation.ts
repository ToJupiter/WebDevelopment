import { ValidationError } from '@/api/auth/auth.validation';

function isValidIsoDate(value?: string) {
  if (typeof value !== 'string') return false;
  
  const date = new Date(value);
  if (isNaN(date.getTime())) return false;
  
  // RFC 3339/ISO 8601 patterns
  const isoPatterns = [
    // YYYY-MM-DDTHH:mm:ss.sssZ (UTC)
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/,
    
    // YYYY-MM-DDTHH:mm:ss.sss±HH:mm (timezone offset)
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?[+-]\d{2}:\d{2}$/,
    
    // YYYY-MM-DDTHH:mm:ssZ (UTC, no milliseconds)
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,
    
    // YYYY-MM-DD (date only)
    /^\d{4}-\d{2}-\d{2}$/
  ];
  
  return isoPatterns.some(pattern => pattern.test(value));
}

export function validateCalendarQuery(query: { start?: string; end?: string }) {
  const errors: ValidationError[] = [];
  if (query.start && !isValidIsoDate(query.start)) {
    errors.push({ field: 'start', message: 'start must be a valid ISO date string' });
  }
  if (query.end && !isValidIsoDate(query.end)) {
    errors.push({ field: 'end', message: 'end must be a valid ISO date string' });
  }
  return errors;
}

export function validateCalendarCreation(body: { title?: string; start_utc?: string; end_utc?: string }) {
  const errors: ValidationError[] = [];
  if (!body.title || body.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'title is required and must be at least 3 characters' });
  }
  if (!isValidIsoDate(body.start_utc)) {
    errors.push({ field: 'start_utc', message: 'start_utc must be a valid ISO date string' });
  }
  if (!isValidIsoDate(body.end_utc)) {
    errors.push({ field: 'end_utc', message: 'end_utc must be a valid ISO date string' });
  }
  if (body.start_utc && body.end_utc) {
    const start = new Date(body.start_utc);
    const end = new Date(body.end_utc);
    if (start > end) {
      errors.push({ field: 'end_utc', message: 'end_utc must be after start_utc' });
    }
  }
  return errors;
}

export function validateCalendarUpdate(body: { title?: string; start_utc?: string; end_utc?: string }) {
  const errors: ValidationError[] = [];
  if (body.title && body.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'title must be at least 3 characters if provided' });
  }
  if (body.start_utc && !isValidIsoDate(body.start_utc)) {
    errors.push({ field: 'start_utc', message: 'start_utc must be a valid ISO date string' });
  }
  if (body.end_utc && !isValidIsoDate(body.end_utc)) {
    errors.push({ field: 'end_utc', message: 'end_utc must be a valid ISO date string' });
  }
  if (body.start_utc && body.end_utc) {
    const start = new Date(body.start_utc);
    const end = new Date(body.end_utc);
    if (start > end) {
      errors.push({ field: 'end_utc', message: 'end_utc must be after start_utc' });
    }
  }
  return errors;
}
