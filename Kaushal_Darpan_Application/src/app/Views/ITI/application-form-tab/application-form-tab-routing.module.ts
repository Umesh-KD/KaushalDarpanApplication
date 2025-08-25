import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationFormTabComponent } from './application-form-tab.component';

const routes: Routes = [{ path: '', component: ApplicationFormTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationFormTabRoutingModule { }
