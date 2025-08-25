import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplyForHostelComponent } from './apply-for-hostel.component';

const routes: Routes = [{ path: '', component: ApplyForHostelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplyForHostelRoutingModule { }
