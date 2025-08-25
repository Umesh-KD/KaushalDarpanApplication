import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DteEquipmentsMasterComponent } from './dteequipments-master.component';






const routes: Routes = [{ path: '', component: DteEquipmentsMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DteEquipmentsMasterRoutingModule { }
