import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalDetailsTabRoutingModule } from './personal-details-tab-routing.module';
import { PersonalDetailsTabComponent } from './personal-details-tab.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';



@NgModule({
  declarations: [
    PersonalDetailsTabComponent
  ],
  imports: [
    CommonModule,
    PersonalDetailsTabRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class PersonalDetailsTabModule { }
