import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorOptionFormComponent } from './instructor-option-form.component';

const routes: Routes = [{ path: '', component: InstructorOptionFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorOptionFormRoutingModule { }
