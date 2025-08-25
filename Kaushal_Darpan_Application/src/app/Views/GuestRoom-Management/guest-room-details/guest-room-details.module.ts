import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestRoomDetailsComponent } from './guest-room-details.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: GuestRoomDetailsComponent }];

@NgModule({
  declarations: [
    GuestRoomDetailsComponent
  ],
  imports: [
    CommonModule, MaterialModule, RouterModule.forChild(routes), MaterialModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class GuestRoomDetailsModule { }
