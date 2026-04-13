import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StaffAssignmentComponent } from './staff-assignment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';



const routes: Routes = [{ path: '', component: StaffAssignmentComponent }];

@NgModule({
  declarations: [StaffAssignmentComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class StaffAssignmentModule { }
