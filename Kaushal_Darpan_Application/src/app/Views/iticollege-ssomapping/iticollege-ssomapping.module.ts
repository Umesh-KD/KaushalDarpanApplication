import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITICollegeSSOMappingRoutingModule } from './iticollege-ssomapping-routing.module';
import { ITICollegeSSOMappingComponent } from './iticollege-ssomapping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ITICollegeSSOMappingComponent
  ],
  imports: [
    CommonModule,
    ITICollegeSSOMappingRoutingModule, FormsModule, ReactiveFormsModule, LoaderModule
  ]
})

  
export class ITICollegeSSOMappingModule { }
