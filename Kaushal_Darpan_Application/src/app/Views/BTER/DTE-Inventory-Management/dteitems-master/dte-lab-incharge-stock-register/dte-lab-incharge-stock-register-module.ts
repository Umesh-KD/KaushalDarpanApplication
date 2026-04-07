import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module'; 
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { DTELabInchargeStockRegisterComponent } from './dte-lab-incharge-stock-register.component';
import { DTELabInchargeStockRegisterRoutingModule } from './dte-lab-incharge-stock-register.routing.module';
 

@NgModule({
  declarations: [
    DTELabInchargeStockRegisterComponent
  ],
  imports: [
    CommonModule,
    DTELabInchargeStockRegisterRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class DTELabInchargeStockRegisterModule { }
