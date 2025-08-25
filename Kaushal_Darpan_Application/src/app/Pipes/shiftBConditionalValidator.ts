import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const shiftBConditionalValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const districtID = group.get('DistrictID')?.value;
  const instituteID = group.get('InstituteID')?.value;

  const anyFilled = districtID || instituteID ;

  if (anyFilled) {
    const errors: ValidationErrors = {};

    if (!districtID) errors['DistrictIDRequired'] = true;
    if (!instituteID) errors['InstituteIDRequired'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  // No fields filled, skip validation
  return null;
};
