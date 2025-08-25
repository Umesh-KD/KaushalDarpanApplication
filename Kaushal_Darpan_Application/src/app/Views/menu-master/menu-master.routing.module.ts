import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuMasterComponent } from './menu-master.component';


const routes: Routes = [{ path: '', component: MenuMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuMasterRoutingModule { }
