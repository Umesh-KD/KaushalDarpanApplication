import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DTEEquipmentVerificationsMappingListComponent } from './DTEEquipmentVerifications-mapping-list.component';



const routes: Routes = [{ path: '', component: DTEEquipmentVerificationsMappingListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DTEEquipmentVerificationsMappingListRoutingModule { }


