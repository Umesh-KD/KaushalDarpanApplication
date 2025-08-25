import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiMeritComponent } from './iti-merit.component';

const routes: Routes = [{ path: '', component: ItiMeritComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiMeritRoutingModule { }
