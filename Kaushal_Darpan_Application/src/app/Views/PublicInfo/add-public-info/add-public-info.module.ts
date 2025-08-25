import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPublicInfoRoutingModule } from './add-public-info-routing.module';
import { AddPublicInfoComponent } from './add-public-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AddPublicInfoComponent
  ],
  imports: [
    CommonModule,
    AddPublicInfoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class AddPublicInfoModule { }
