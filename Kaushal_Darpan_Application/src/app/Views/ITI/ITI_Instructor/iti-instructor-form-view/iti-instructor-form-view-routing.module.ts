import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiInstructorFormViewComponent } from './iti-instructor-form-view.component';

const routes: Routes = [{ path: '', component: ItiInstructorFormViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiInstructorViewRoutingModule { }
