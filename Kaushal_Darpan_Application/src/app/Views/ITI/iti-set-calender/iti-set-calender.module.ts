import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiSetCalenderRoutingModule } from './iti-set-calender-routing.module';
import { ItiSetCalenderComponent } from './iti-set-calender.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ItiSetCalenderComponent
  ],
  imports: [
    CommonModule,
    ItiSetCalenderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class ItiSetCalenderModule { }
