import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DteTradeEquipmentsMappingListComponent } from './dtetrade-equipments-mapping-list.component';



const routes: Routes = [{ path: '', component: DteTradeEquipmentsMappingListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DteTradeEquipmentsMappingListRoutingModule { }


