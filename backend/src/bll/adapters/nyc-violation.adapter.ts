import { NycViolation } from '../../dal/entities/nyc-violation.entity';

export class NycViolationAdapter {
  /**
   * Adapts the raw JSON record from the Socrata API into the internal NycViolation entity format.
   * Handles property name conversions (snake_case to camelCase) and type conversions.
   */
  static adapt(rawData: any): NycViolation {
    const entity = new NycViolation();
    entity.plate = rawData.plate;
    entity.state = rawData.state;
    entity.licenseType = rawData.license_type;
    entity.issueDate = rawData.issue_date;
    entity.violationTime = rawData.violation_time;
    entity.violation = rawData.violation;
    
    // Safely parse float or default to 0
    entity.fineAmount = rawData.fine_amount ? parseFloat(rawData.fine_amount) : 0;
    
    return entity;
  }
}
