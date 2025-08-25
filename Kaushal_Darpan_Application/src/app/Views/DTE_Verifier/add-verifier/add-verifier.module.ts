import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AddVerifierComponent } from './add-verifier.component';
import { AddVerifierRoutingModule } from './add-verifier-routing.module';



@NgModule({
    declarations: [
        AddVerifierComponent
    ],
    imports: [
        CommonModule,
        AddVerifierRoutingModule,
        FormsModule,
        LoaderModule,
        TableSearchFilterModule,
        ReactiveFormsModule
    ]
})
export class AddVerifierModule { }
