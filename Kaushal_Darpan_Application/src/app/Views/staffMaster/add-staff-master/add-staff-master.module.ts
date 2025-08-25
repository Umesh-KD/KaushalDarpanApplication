import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { AddStaffMasterComponent } from './add-staff-master.component';
import { AddStaffMasterRoutingModule } from './add-staff-master-routing.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

@NgModule({
    declarations: [
        AddStaffMasterComponent
    ],
    imports: [
        CommonModule,
        AddStaffMasterRoutingModule,
        FormsModule,
        ReactiveFormsModule,
      LoaderModule,
      TableSearchFilterModule
    ]
})
export class AddStaffMasterModule { }
