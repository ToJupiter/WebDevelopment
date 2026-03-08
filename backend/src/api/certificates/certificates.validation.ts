import { ValidationError } from '@/api/auth/auth.validation';

export function validateCertificatePayload(body: { road_map?: string; roadmap_id?: string; certificate_name?: string }) {
  const errors: ValidationError[] = [];
  const roadmapId = body.roadmap_id || body.road_map;
  if (!roadmapId || roadmapId.trim().length === 0) {
    errors.push({ field: 'roadmap_id', message: 'roadmap_id is required' });
  }
  if (!body.certificate_name || body.certificate_name.trim().length < 3) {
    errors.push({ field: 'certificate_name', message: 'certificate_name must be at least 3 characters' });
  }
  return errors;
}
