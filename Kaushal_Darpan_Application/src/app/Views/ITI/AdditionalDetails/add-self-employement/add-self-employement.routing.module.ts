import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStudentEmployementComponent } from './add-self-employement.component';





const routes: Routes = [{ path: '', component: AddStudentEmployementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddStudentEmployementRoutingModule { }
