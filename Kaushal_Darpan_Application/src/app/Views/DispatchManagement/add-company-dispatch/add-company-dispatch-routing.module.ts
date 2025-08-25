import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { addcompanydispatchComponent } from './add-company-dispatch.component';

const routes: Routes = [{ path: '', component: addcompanydispatchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class addcompanydispatchComponentRoutingModule { }
