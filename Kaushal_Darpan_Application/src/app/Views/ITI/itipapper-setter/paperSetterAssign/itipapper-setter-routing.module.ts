import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIPapperSetterComponent } from './itipapper-setter.component';

const routes: Routes = [{ path: '', component: ITIPapperSetterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIPapperSetterRoutingModule { }
