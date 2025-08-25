import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { VerifyStudentApplicationComponent } from './verify-student-application.component';
import { VerifyStudentApplicationRoutingModule } from './verify-student-application-routing.module';



@NgModule({
    declarations: [
        VerifyStudentApplicationComponent
    ],
    imports: [
        CommonModule,
        VerifyStudentApplicationRoutingModule,
        FormsModule,
        LoaderModule,
        TableSearchFilterModule,
        ReactiveFormsModule
    ]
})
export class VerifyStudentApplicationModule { }
