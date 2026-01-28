import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { downloadITIResultRoutingModule } from './download-ITI-Result.routing.module';
import { downloadITIResultComponent } from './download-ITI-Result.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    downloadITIResultComponent
  ],
  imports: [
    CommonModule,
    downloadITIResultRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class downloadITIResultModule { }
