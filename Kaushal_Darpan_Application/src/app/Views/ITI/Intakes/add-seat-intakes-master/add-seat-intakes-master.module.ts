import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSeatIntakesMasterRoutingModule } from './add-seat-intakes-master-routing.module';
import { AddSeatIntakesMasterComponent } from './add-seat-intakes-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddSeatIntakesMasterComponent
  ],
  imports: [
    CommonModule,
    AddSeatIntakesMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgSelectModule
  ]
})
export class AddSeatIntakesMasterModule { }
