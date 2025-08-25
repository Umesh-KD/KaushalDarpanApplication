import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddScholarshipListRoutingModule } from './add-scholarship-list-routing.module';
import { AddScholarshipListComponent } from './add-scholarship-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddScholarshipListComponent
  ],
  imports: [
    CommonModule,
    AddScholarshipListRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddScholarshipListModule { }
