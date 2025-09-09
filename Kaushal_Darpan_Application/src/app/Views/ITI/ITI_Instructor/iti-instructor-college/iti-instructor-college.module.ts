import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { MaterialModule } from '../../../../material.module';
import { ItiInstructorCollegeComponent } from './iti-instructor-college.component';



const routes: Routes = [{ path: '', component: ItiInstructorCollegeComponent }];
@NgModule({
  declarations: [
    ItiInstructorCollegeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class ItiInstructorCollegeModule { }
