import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiInstructorFormComponent } from './iti-instructor-form.component';

const routes: Routes = [{ path: '', component: ItiInstructorFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiInstructorRoutingModule { }
