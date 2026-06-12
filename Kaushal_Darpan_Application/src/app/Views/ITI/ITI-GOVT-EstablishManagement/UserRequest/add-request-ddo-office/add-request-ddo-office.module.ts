import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { AddRequestDDOOfficeComponent } from './add-request-ddo-office.component';
import { AddRequestDDOOfficeRoutingModule } from './add-request-ddo-office-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { OTPModalModule } from '../../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    AddRequestDDOOfficeComponent
  ],
  imports: [
    CommonModule,
    AddRequestDDOOfficeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgSelectModule,
    OTPModalModule
  ]
})
export class AddRequestDDOOfficeModule { }
