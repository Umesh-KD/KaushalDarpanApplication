import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCollegeMasterRoutingModule } from './add-college-master-routing.module';
import { AddCollegeMasterComponent } from './add-college-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AddCollegeMasterComponent
  ],
  imports: [
    CommonModule,
    AddCollegeMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class AddCollegeMasterModule { }
