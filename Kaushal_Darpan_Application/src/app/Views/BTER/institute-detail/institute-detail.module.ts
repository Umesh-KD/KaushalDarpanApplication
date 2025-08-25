import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstituteDetailRoutingModule } from './institute-detail-routing.module';
import { InstituteDetailComponent } from './institute-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    InstituteDetailComponent
  ],
  imports: [
    CommonModule,
    InstituteDetailRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class InstituteDetailModule { }
