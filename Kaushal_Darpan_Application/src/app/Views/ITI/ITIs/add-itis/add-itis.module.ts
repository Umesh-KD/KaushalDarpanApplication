import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddITIsRoutingModule } from './add-itis-routing.module';
import { AddITIsComponent } from './add-itis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AddITIsComponent
  ],
  imports: [
    CommonModule,
    AddITIsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class AddITIsModule { }
