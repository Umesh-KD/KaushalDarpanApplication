import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCentersRoutingModule } from './add-centers-routing.module';
import { AddCentersComponent } from './add-centers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AddCentersComponent
  ],
  imports: [
    CommonModule,
    AddCentersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class AddCentersModule { }
