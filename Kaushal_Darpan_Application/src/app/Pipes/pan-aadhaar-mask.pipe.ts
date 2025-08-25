import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'panAadhaarMask',
  standalone: false
})
export class PanAadhaarMaskPipe implements PipeTransform
{

  transform(value: string, type: 'aadhaar' | 'pan'): string {
    if (!value) return '';

    if (type === 'aadhaar' && value.length === 12) {
      return `XXXX-XXXX-${value.slice(-4)}`;
    }

    if (type === 'pan' && value.length === 10) {
      return `XXXXX${value.slice(-5)}`;
    }

    return value;
  }
}
