import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { RevalExaminersComponent } from './reval-examiners.component';
import { RevalExaminersRoutingModule } from './reval-examiners-routing.module';



@NgModule({
    declarations: [
        RevalExaminersComponent
    ],
    imports: [
        CommonModule,
        RevalExaminersRoutingModule,
        FormsModule,
        LoaderModule,
        TableSearchFilterModule
    ]
})
export class RevalExaminersModule { }
