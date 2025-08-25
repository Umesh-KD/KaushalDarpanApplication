import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGuestRoomComponent } from './Create-GuestRoom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';

const routes: Routes = [{ path: '', component: CreateGuestRoomComponent }];

@NgModule({
  declarations: [
   CreateGuestRoomComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
    TableSearchFilterModule,
    RouterModule.forChild(routes)
  ]
})
export class CreateGuestRoomModule { }


