import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DTELabInchargeStockRegisterComponent } from './dte-lab-incharge-stock-register.component';
 

const routes: Routes = [{ path: '', component: DTELabInchargeStockRegisterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DTELabInchargeStockRegisterRoutingModule { }


