import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UploadTraineeLogsListComponent } from './upload-trainee-logs-list.component';
import { UploadTraineeLogsListRoutingModule } from './upload-trainee-logs-list-routing.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    UploadTraineeLogsListComponent
  ],
  imports: [
    CommonModule,
   UploadTraineeLogsListRoutingModule,  
    LoaderModule,
    FormsModule, 
    TableSearchFilterModule,
    ReactiveFormsModule,
    OTPModalModule,
  ]
})
export class UploadTraineeLogsListModule { }
