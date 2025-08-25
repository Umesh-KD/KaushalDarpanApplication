import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AssignApplicationListComponent } from './assign-application-list.component';
import { AssignApplicationListRoutingModule } from './assign-application-list-routing.module';



@NgModule({
    declarations: [
        AssignApplicationListComponent
    ],
    imports: [
        CommonModule,
        AssignApplicationListRoutingModule,
        FormsModule,
        LoaderModule,
        TableSearchFilterModule,
        ReactiveFormsModule
    ]
})
export class AssignApplicationListModule { }
