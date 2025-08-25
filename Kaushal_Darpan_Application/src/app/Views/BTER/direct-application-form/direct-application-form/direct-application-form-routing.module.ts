import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectApplicationFormComponent } from './direct-application-form.component';

const routes: Routes = [{ path: '', component: DirectApplicationFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectApplicationFormRoutingModule { }
