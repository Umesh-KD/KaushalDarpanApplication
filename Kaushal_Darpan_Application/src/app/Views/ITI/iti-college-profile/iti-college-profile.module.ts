import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITICollegeProfileRoutingModule } from './iti-college-profile-routing.module';
import { ITICollegeProfileComponent } from './iti-college-profile.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ITICollegeProfileComponent
  ],
  imports: [
    CommonModule,
    ITICollegeProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class ITICollegeProfileModule { }
