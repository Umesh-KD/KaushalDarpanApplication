import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { StaffMasterRoutingModule } from './staff-master-routing.module';
import { StaffMasterComponent } from './staff-master.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
    declarations: [
        StaffMasterComponent
    ],
    imports: [
        CommonModule,
        StaffMasterRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        LoaderModule,
        TableSearchFilterModule
    ]
})
export class StaffMasterModule { }
