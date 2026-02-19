import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { itiAddAdminSubUserRoutingModule } from './iti-Add-Admin-Sub-User-routing.module'; 
import { itiAddAdminSubUserComponent } from './iti-Add-Admin-Sub-User.component';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    itiAddAdminSubUserComponent
  ],
  imports: [
    CommonModule,
    itiAddAdminSubUserRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class itiAddAdminSubUserModule { }
