import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDirectprivateApplicationFormTabComponent } from './iti-direct-private-application-form-tab.component';

const routes: Routes = [{ path: '', component: ITIDirectprivateApplicationFormTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDirectprivateApplicationFormTabRoutingModule { }
