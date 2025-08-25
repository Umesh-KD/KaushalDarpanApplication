import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { VerifierComponent } from './verifier.component';
import { VerifierRoutingModule } from './verifier-routing.module';



@NgModule({
    declarations: [
        VerifierComponent
    ],
    imports: [
        CommonModule,
        VerifierRoutingModule,
        FormsModule,
        LoaderModule,
        TableSearchFilterModule,
        ReactiveFormsModule
    ]
})
export class VerifierModule { }
