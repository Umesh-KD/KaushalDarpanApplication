import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherDetailsFormComponent } from './other-details-form.component';

const routes: Routes = [{ path: '', component: OtherDetailsFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherDetailsFormRoutingModule { }
