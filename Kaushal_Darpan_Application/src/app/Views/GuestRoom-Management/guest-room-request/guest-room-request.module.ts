import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestRoomRequestComponent } from './guest-room-request.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';

const routes: Routes = [{ path: '', component: GuestRoomRequestComponent }];

@NgModule({
  declarations: [
    GuestRoomRequestComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes), MaterialModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class GuestRoomRequestModule { }
