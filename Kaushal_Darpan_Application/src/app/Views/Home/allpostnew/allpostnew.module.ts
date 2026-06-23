import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllpostnewRoutingModule } from './allpostnew-routing.module';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AllpostnewComponent } from './allpostnew.component';


@NgModule({
  declarations: [
    AllpostnewComponent
  ],
  imports: [
    CommonModule,
    AllpostnewRoutingModule,
    FormsModule ,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class AllpostnewModule { }
