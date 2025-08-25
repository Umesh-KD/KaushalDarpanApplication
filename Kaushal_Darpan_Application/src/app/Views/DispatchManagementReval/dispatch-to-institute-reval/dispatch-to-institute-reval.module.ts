import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchToInstituteRevalRoutingModule } from './dispatch-to-institute-reval-routing.module';
import { DispatchToInstituteRevalComponent } from './dispatch-to-institute-reval.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    DispatchToInstituteRevalComponent
  ],
  imports: [
    CommonModule,
    DispatchToInstituteRevalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule, NgSelectModule,
  ]
})
export class DispatchToInstituteRevalModule { }
