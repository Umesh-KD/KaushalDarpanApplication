import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiInvigilatorRoutingModule } from './iti-invigilator-routing.module';
import { ItiInvigilatorComponent } from './iti-invigilator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AddItiInvigilatorModule } from '../add-iti-invigilator/add-iti-invigilator.module';


@NgModule({
  declarations: [
    ItiInvigilatorComponent
  ],
  imports: [
    CommonModule,
    ItiInvigilatorRoutingModule,
    TableSearchFilterModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    /* ItiInvigilatorModule*/
    AddItiInvigilatorModule
  ]
})
export class ItiInvigilatorModule { }
