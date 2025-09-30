import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiChangeShiftComponent } from './iti-change-shift.component';

const routes: Routes = [{ path: '', component: ItiChangeShiftComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiChangeShiftRoutingModule { }
