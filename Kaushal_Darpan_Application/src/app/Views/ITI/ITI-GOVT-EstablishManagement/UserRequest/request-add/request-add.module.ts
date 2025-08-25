import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestUserAddRoutingModule } from './request-add-routing.module';
import { RequestUserAddComponent } from './request-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    RequestUserAddComponent
  ],
  imports: [
    CommonModule,
    RequestUserAddRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class RequestUserAddModule { }
