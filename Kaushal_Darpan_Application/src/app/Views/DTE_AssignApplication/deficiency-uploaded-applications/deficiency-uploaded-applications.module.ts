import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { DeficiencyUploadedApplicationsComponent } from './deficiency-uploaded-applications.component';
import { DeficiencyUploadedApplicationsRoutingModule } from './deficiency-uploaded-applications-routing.module';



@NgModule({
    declarations: [
        DeficiencyUploadedApplicationsComponent
    ],
    imports: [
        CommonModule,
        DeficiencyUploadedApplicationsRoutingModule,
        FormsModule,
        LoaderModule,
        TableSearchFilterModule,
        ReactiveFormsModule
    ]
})
export class DeficiencyUploadedApplicationsModule { }
