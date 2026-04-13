import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { UserRequestListTransferComponent } from './user-request-list-transfer.component';
import { UserRequestListTransferRoutingModule } from './user-request-list-transfer-routing.module';


@NgModule({
  declarations: [
    UserRequestListTransferComponent
  ],
  imports: [
    CommonModule,
    UserRequestListTransferRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class UserRequestListTransferModule { }
