import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { addcompanydispatchComponentRoutingModule } from './add-company-dispatch-routing.module';
import { addcompanydispatchComponent } from './add-company-dispatch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    addcompanydispatchComponent
  ],
  imports: [
    CommonModule,
    addcompanydispatchComponentRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule
  ]
})
export class addcompanydispatchModule { }
