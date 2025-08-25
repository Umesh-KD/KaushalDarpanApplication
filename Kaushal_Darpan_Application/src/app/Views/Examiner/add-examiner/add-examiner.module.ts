import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AddExaminerComponent } from './add-examiner.component';
import { AddExaminerRoutingModule } from './add-examiner-routing.module';



@NgModule({
    declarations: [
        AddExaminerComponent
    ],
    imports: [
        CommonModule,
        AddExaminerRoutingModule,
        FormsModule,
        LoaderModule,
        TableSearchFilterModule
    ]
})
export class AddExaminerModule { }
