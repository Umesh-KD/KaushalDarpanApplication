import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIDispatchToInstituteRoutingModule } from './ITI-Dispatch-to-institute-routing.module';
import { ITIDispatchToInstituteComponent } from './ITI-Dispatch-to-institute.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ITIDispatchToInstituteComponent
  ],
  imports: [
    CommonModule,
    ITIDispatchToInstituteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule, NgSelectModule,
  ]
})
export class ITIDispatchToInstituteModule { }
