import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItiExaminationCollegeComponent } from './iti-examination-college.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [{ path: '', component: ItiExaminationCollegeComponent }];
@NgModule({
  declarations: [
    ItiExaminationCollegeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ItiExaminationCollegeModule { }
