import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorSelectchoiceComponent } from './instructor-selectchoice.component';

const routes: Routes = [{ path: '', component: InstructorSelectchoiceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorSelectchoiceRoutingModule { }
