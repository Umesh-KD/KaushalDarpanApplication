import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiPlaningDetailsComponent } from './iti-planing-details.component';

const routes: Routes = [{ path: '', component: ItiPlaningDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiPlaningDetailsRoutingModule { }
