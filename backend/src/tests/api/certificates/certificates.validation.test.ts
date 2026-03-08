import { validateCertificatePayload} from '@/api/certificates/certificates.validation';

describe('validateCertificatePayload', () => {
  it('should return no errors for valid input', () => {
    const body = {
      roadmap_id: '123e4567-e89b-12d3-a456-426614174000',
      certificate_name: 'Full Stack Development'
    };
    const errors = validateCertificatePayload(body);
    expect(errors).toHaveLength(0);
  });

  it('should accept road_map as alias for roadmap_id', () => {
    const body = {
      road_map: '123e4567-e89b-12d3-a456-426614174000',
      certificate_name: 'Full Stack Development'
    };
    const errors = validateCertificatePayload(body);
    expect(errors).toHaveLength(0);
  });

  it('should validate roadmap_id is required', () => {
    const body = {
      certificate_name: 'Full Stack Development'
    };
    const errors = validateCertificatePayload(body);
    expect(errors).toContainEqual({
      field: 'roadmap_id',
      message: 'roadmap_id is required'
    });
  });

  it('should reject empty roadmap_id', () => {
    const body = {
      roadmap_id: '',
      certificate_name: 'Full Stack Development'
    };
    const errors = validateCertificatePayload(body);
    expect(errors.some(e => e.field === 'roadmap_id')).toBe(true);
  });

  it('should reject whitespace-only roadmap_id', () => {
    const body = {
      roadmap_id: '   ',
      certificate_name: 'Full Stack Development'
    };
    const errors = validateCertificatePayload(body);
    expect(errors.some(e => e.field === 'roadmap_id')).toBe(true);
  });

  it('should validate certificate_name minimum length', () => {
    const body = {
      roadmap_id: '123e4567-e89b-12d3-a456-426614174000',
      certificate_name: 'AB'
    };
    const errors = validateCertificatePayload(body);
    expect(errors).toContainEqual({
      field: 'certificate_name',
      message: 'certificate_name must be at least 3 characters'
    });
  });

  it('should reject empty certificate_name', () => {
    const body = {
      roadmap_id: '123e4567-e89b-12d3-a456-426614174000',
      certificate_name: ''
    };
    const errors = validateCertificatePayload(body);
    expect(errors.some(e => e.field === 'certificate_name')).toBe(true);
  });

  it('should return multiple errors for missing fields', () => {
    const body = {};
    const errors = validateCertificatePayload(body);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.map(e => e.field)).toContain('roadmap_id');
    expect(errors.map(e => e.field)).toContain('certificate_name');
  });
});