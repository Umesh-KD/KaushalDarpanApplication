import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { IDFFundDetailsRoutingModule } from './idffund-details-routing.module';
import { IDFFundDetailsComponent } from './idffund-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    IDFFundDetailsComponent
  ],
  imports: [
    CommonModule,
    IDFFundDetailsRoutingModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class IDFFundDetailsModule { }
