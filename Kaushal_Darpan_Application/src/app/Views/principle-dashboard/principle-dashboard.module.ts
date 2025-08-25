import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '../Shared/loader/loader.module';

import { PrincipleDashboardComponent } from './principle-dashboard.component';
import { PrincipleDashboardRoutingModule } from './principle-dashboard.routing.module';


@NgModule({
  declarations: [
    PrincipleDashboardComponent

  ],
  imports: [
    CommonModule,
    PrincipleDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ], exports: [PrincipleDashboardComponent]
})
export class PrincipleDashboardModule { }
