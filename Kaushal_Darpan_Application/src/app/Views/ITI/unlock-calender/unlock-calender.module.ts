import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnlockCalenderRoutingModule } from './unlock-calender-routing.module';
import { UnlockCalenderComponent } from './unlock-calender.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    UnlockCalenderComponent
  ],
  imports: [
    CommonModule,
    UnlockCalenderRoutingModule,
    ReactiveFormsModule, FormsModule,
    LoaderModule
  ]
})
export class UnlockCalenderModule { }
