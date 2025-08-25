import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainItiInstructorFormComponent } from './main-iti-instructor-form.component';

const routes: Routes = [{ path: '', component: MainItiInstructorFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainItiInstructorRoutingModule { }
