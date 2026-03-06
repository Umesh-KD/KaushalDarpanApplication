import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDirectApplicationPrivateFormTabComponent } from './iti-direct-application-private-form-tab.component';

const routes: Routes = [{ path: '', component: ITIDirectApplicationPrivateFormTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDirectApplicationPrivateFormTabRoutingModule { }
