import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BterUnlockCalenderRoutingModule } from './bter-unlock-calender-routing.module';
import { BterUnlockCalenderComponent } from './bter-unlock-calender.component';
import { LoaderModule } from '../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BterUnlockCalenderComponent
  ],
  imports: [
    CommonModule,
    BterUnlockCalenderRoutingModule,
    ReactiveFormsModule, FormsModule,
    LoaderModule
  ]
})
export class BterUnlockCalenderModule { }
