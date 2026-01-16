import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BhandarFormComponent } from './bhandar-form.component';

const routes: Routes = [{ path: '', component: BhandarFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BhandarFormRoutingModule { }
