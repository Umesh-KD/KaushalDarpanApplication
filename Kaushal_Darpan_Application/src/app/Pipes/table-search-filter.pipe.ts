import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tableSearchFilter',
    standalone: false
})
export class TableSearchFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();
     

    return value.filter(function (item: any) {
      return JSON.stringify(item) 
        .toLowerCase()
        .includes(args);
    });
  }

  //  transform(items: any[], searchText: string): any[] {
  // if (!items || !searchText) {
  //   return items;
  // }
  // searchText = searchText.toLowerCase();
  // return items.filter(item =>
  //   item.CandidateName.toLowerCase().includes(searchText) ||
  //   item.MobileNo.toLowerCase().includes(searchText) ||
  //   item.TradeName.toLowerCase().includes(searchText)
  // );
  // }
}