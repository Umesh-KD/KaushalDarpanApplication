import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';

export const uniqueEquipmentCodeValidator: ValidatorFn = (formArray: AbstractControl): ValidationErrors | null => {
  if (!(formArray instanceof FormArray)) return null;

  const seen = new Set<string>();
  let hasDuplicate = false;

  for (const control of formArray.controls) {
    const code = control.get('txtEquipmentCode')?.value?.trim();
    if (!code) continue;

    if (seen.has(code)) {
      hasDuplicate = true;
      break;
    }
    seen.add(code);
  }

  return hasDuplicate ? { duplicateCodes: true } : null;
};
