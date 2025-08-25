import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDirectApplicationFormTabComponent } from './iti-direct-application-form-tab.component';

const routes: Routes = [{ path: '', component: ITIDirectApplicationFormTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDirectApplicationFormTabRoutingModule { }
