import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIAddcompanydispatchComponent } from './iti-addcompanydispatch.component';

const routes: Routes = [{ path: '', component: ITIAddcompanydispatchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIAddcompanydispatchRoutingModule { }
