import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorTabComponent } from './instructor-tab.component';

const routes: Routes = [{ path: '', component: InstructorTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorTabRoutingModule { }
