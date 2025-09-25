import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegenerateHostelMeritComponent } from './regenerate-hostel-merit.component';

const routes: Routes = [{ path: '', component: RegenerateHostelMeritComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegenerateHostelMeritRoutingModule { }
