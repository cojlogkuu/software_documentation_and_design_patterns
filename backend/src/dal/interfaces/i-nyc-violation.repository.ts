import { NycViolation } from '../entities/nyc-violation.entity';

export const INycViolationRepositoryToken = Symbol('INycViolationRepository');

export interface INycViolationRepository {
  saveViolations(violations: NycViolation[]): Promise<NycViolation[]>;
  getAllViolations(): Promise<NycViolation[]>;
}
