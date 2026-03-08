import { isValidRoadmapId } from '@/api/roadmaps/roadmaps.validation';

describe('isValidRoadmapId', () => {
  it('should return true for valid UUID v4', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';
    expect(isValidRoadmapId(validUuid)).toBe(true);
  });

  it('should return true for valid UUID with uppercase letters', () => {
    const validUuid = '123E4567-E89B-12D3-A456-426614174ABC';
    expect(isValidRoadmapId(validUuid)).toBe(true);
  });

  it('should return false for invalid UUID format', () => {
    const invalidUuids = [
      'invalid-uuid',
      '123e4567-e89b-12d3-a456', // incomplete
      '123e4567e89b12d3a456426614174000', // no hyphens
      '123e4567-e89b-12d3-a456-426614174000-extra', // too long
      '', // empty string
      '   ', // whitespace
    ];
    invalidUuids.forEach(uuid => {
      expect(isValidRoadmapId(uuid)).toBe(false);
    });
  });

  it('should return false for non-string values', () => {
    const nonStrings = [null, undefined, 123, {}, []];
    nonStrings.forEach(value => {
      expect(isValidRoadmapId(value as any)).toBe(false);
    });
  });
});