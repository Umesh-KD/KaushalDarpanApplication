import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StaffAssignmentComponent } from './staff-assignment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../../material.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';



const routes: Routes = [{ path: '', component: StaffAssignmentComponent }];

@NgModule({
  declarations: [StaffAssignmentComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule, MaterialModule, LoaderModule, TableSearchFilterModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class StaffAssignmentModule { }
