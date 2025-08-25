import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddGroupsRoutingModule } from './add-groups-routing.module';
import { AddGroupsComponent } from './add-groups.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AddGroupsComponent
  ],
  imports: [
    CommonModule,
    AddGroupsRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule
  ]
})
export class AddGroupsModule { }
