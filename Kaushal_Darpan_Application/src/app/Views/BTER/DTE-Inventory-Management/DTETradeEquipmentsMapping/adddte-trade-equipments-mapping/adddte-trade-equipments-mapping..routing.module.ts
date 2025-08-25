import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDteTradeEquipmentsMappingComponent } from './adddte-trade-equipments-mapping.component';






const routes: Routes = [{ path: '', component: AddDteTradeEquipmentsMappingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  
})
export class AddDteTradeEquipmentsMappingRoutingModule { }


