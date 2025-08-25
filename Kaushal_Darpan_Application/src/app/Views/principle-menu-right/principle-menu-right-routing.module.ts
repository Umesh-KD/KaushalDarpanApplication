import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipleMenuRightComponent } from './principle-menu-right.component';

const routes: Routes = [{ path: '', component: PrincipleMenuRightComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipleMenuRightRoutingModule { }
