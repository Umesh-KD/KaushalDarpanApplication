import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { PlacementAllStudentListComponent } from './placement-allstudentlist.component';
import { PlacementAllStudentListRoutingModule } from './placement-allstudentlist.routing.module';

@NgModule({
  declarations: [
    PlacementAllStudentListComponent
  ],
  imports: [
    CommonModule,
    PlacementAllStudentListRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class PlacementAllStudentListMasterModule { }
