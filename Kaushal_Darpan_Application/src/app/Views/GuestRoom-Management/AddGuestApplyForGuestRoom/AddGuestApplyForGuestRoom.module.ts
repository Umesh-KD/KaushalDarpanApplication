import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddGuestApplyForGuestRoomComponent } from './AddGuestApplyForGuestRoom.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: AddGuestApplyForGuestRoomComponent }];

@NgModule({
  declarations: [
    AddGuestApplyForGuestRoomComponent
  ],
  imports: [
    CommonModule, MaterialModule, RouterModule.forChild(routes),
     FormsModule, ReactiveFormsModule,  LoaderModule, TableSearchFilterModule
  ]
})
export class AddGuestApplyForGuestRoomModule { }
