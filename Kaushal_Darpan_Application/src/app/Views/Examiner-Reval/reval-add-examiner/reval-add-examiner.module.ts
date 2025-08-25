import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { RevalAddExaminerComponent } from './reval-add-examiner.component';
import { RevalAddExaminerRoutingModule } from './reval-add-examiner-routing.module';



@NgModule({
    declarations: [
        RevalAddExaminerComponent
    ],
    imports: [
        CommonModule,
        RevalAddExaminerRoutingModule,
        FormsModule,
        LoaderModule,
        TableSearchFilterModule
    ]
})
export class RevalAddExaminerModule { }
