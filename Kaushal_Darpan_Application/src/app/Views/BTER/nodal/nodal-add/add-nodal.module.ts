import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { AddNodalComponent } from './add-nodal.component';
import { AddNodalRoutingModule } from './add-nodal-routing.module';



@NgModule({
    declarations: [
        AddNodalComponent
    ],
    imports: [
        CommonModule,
       AddNodalRoutingModule,
        FormsModule,
        LoaderModule,
        TableSearchFilterModule,
        ReactiveFormsModule
    ]
})
export class AddNodalModule { }
