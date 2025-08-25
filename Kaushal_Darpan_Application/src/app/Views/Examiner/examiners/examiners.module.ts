import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ExaminersComponent } from './examiners.component';
import { ExaminersRoutingModule } from './examiners-routing.module';



@NgModule({
    declarations: [
        ExaminersComponent
    ],
    imports: [
        CommonModule,
        ExaminersRoutingModule,
        FormsModule,
        LoaderModule,
        TableSearchFilterModule
    ]
})
export class ExaminersModule { }
