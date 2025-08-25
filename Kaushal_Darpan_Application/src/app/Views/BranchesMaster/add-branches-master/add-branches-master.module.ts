import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBranchesMasterRoutingModule } from './add-branches-master-routing.module';
import { AddBranchesMasterComponent } from './add-branches-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AddBranchesMasterComponent
  ],
  imports: [
    CommonModule,
    AddBranchesMasterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    LoaderModule
  ]
})
export class AddBranchesMasterModule { }
