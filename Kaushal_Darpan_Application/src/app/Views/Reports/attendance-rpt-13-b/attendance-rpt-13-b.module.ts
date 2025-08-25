import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AttendanceRpt13BComponent } from './attendance-rpt-13-b.component';
import { AttendanceRpt13BRoutingModule } from './attendance-rpt-13-b-routing.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
    declarations: [
        AttendanceRpt13BComponent
    ],
    imports: [
        CommonModule,
        AttendanceRpt13BRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        LoaderModule,
        TableSearchFilterModule,
        OTPModalModule
    ]
})
export class AttendanceRpt13BModule { }
