import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { DataTableComponent } from './data-table.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [DataTableComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    DataTableComponent
  ]
})
export class DataTableModule { }
