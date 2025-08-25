import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mobileMask',
    standalone: false
})
export class MobileMaskPipe implements PipeTransform {
  transform(value: string | number): string {
    const strValue = value.toString();
    if (strValue.length < 4) {
      return strValue; // No masking for short numbers
    }
    return strValue.slice(0, -4).replace(/\d/g, '*') + strValue.slice(-4);
  }
}
