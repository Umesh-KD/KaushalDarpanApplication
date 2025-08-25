import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITICompanydispatchlistRoutingModule } from './iti-companydispatchlist-routing.module';
import { ITICompanydispatchlistComponent } from './iti-companydispatchlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ITICompanydispatchlistComponent
  ],
  imports: [
    CommonModule,
    ITICompanydispatchlistRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    MaterialModule, NgSelectModule, OTPModalModule
  ]
})
export class ITICompanydispatchlistModule { }
