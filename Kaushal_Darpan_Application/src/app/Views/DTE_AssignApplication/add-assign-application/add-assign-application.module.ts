import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AddAssignApplicationComponent } from './add-assign-application.component';
import { AddAssignApplicationRoutingModule } from './add-assign-application-routing.module';



@NgModule({
    declarations: [
        AddAssignApplicationComponent
    ],
    imports: [
        CommonModule,
        AddAssignApplicationRoutingModule,
        FormsModule,
        LoaderModule,
        TableSearchFilterModule,
        ReactiveFormsModule
    ]
})
export class AddAssignApplicationModule { }
