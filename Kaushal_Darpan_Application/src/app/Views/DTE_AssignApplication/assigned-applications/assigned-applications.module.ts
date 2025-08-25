import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AssignedApplicationsComponent } from './assigned-applications.component';
import { AssignedApplicationsRoutingModule } from './assigned-applications-routing.module';



@NgModule({
    declarations: [
        AssignedApplicationsComponent
    ],
    imports: [
        CommonModule,
        AssignedApplicationsRoutingModule,
        FormsModule,
        LoaderModule,
        TableSearchFilterModule,
        ReactiveFormsModule
    ]
})
export class AssignedApplicationsModule { }
