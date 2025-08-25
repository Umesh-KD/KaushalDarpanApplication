import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditApplicationFormComponent } from './application-form.component';

const routes: Routes = [{ path: '', component: EditApplicationFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditApplicationFormRoutingModule { }
