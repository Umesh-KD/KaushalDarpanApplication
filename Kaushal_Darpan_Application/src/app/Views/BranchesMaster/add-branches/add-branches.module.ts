import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBranchesRoutingModule } from './add-branches-routing.module';
import { AddBranchesMasterComponent } from './add-branches.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AddBranchesMasterComponent
  ],
  imports: [
    CommonModule,
    AddBranchesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    LoaderModule
  ]
})
export class AddBranchesModule { }
