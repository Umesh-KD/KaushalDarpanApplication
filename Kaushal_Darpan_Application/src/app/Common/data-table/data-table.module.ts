import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { DataTableComponent } from './data-table.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [DataTableComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    DataTableComponent
  ]
})
export class DataTableModule { }
