import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiJailApplicationComponent } from './iti-JailApplication.component';

const routes: Routes = [{ path: '', component: ItiJailApplicationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiJailApplicationRoutingModule { }
