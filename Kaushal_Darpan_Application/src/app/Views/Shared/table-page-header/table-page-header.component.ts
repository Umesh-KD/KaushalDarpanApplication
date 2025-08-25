import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-page-header',
  templateUrl: './table-page-header.component.html',
  styleUrl: './table-page-header.component.css',
  standalone:false
})
export class TablePageHeaderComponent {
  @Input() Title: any[] = []; 
  @Input() Discription: any[] = []; 
}
