import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCenterITIRoutingModule } from './add-center-iti-routing.module';
import { AddCenterITIComponent } from './add-center-iti.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AddCenterITIComponent
  ],
  imports: [
    CommonModule,
    AddCenterITIRoutingModule, FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class AddCenterITIModule { }
