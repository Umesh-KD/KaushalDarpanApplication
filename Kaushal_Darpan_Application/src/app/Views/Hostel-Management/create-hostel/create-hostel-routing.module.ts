import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateHostelComponent } from './create-hostel.component';

const routes: Routes = [{ path: '', component: CreateHostelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateHostelRoutingModule { }
