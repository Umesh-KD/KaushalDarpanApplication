import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
    standalone: false
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], condition: { [key: string]: any }): any[] {
    if (!items || !condition) {
      return items;
    }

    const [key, value] = Object.entries(condition)[0]; // Extract key-value pair
    return items.filter(item => item[key] === value);
  }

}
