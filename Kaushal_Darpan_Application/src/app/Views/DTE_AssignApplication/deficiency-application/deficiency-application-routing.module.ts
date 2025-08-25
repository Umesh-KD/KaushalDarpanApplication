import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeficiencyApplicationComponent } from './deficiency-application.component';

const routes: Routes = [{ path: '', component: DeficiencyApplicationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeficiencyApplicationRoutingModule { }
