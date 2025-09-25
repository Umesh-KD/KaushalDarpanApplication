import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplyForHostelRoutingModule } from './apply-for-hostel-routing.module';
import { ApplyForHostelComponent } from './apply-for-hostel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ApplyForHostelComponent
  ],
  imports: [
    CommonModule,
    ApplyForHostelRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class ApplyForHostelModule { }
