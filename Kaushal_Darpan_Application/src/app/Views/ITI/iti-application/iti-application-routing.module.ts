import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiApplicationComponent } from './iti-application.component';

const routes: Routes = [{ path: '', component: ItiApplicationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiApplicationRoutingModule { }
