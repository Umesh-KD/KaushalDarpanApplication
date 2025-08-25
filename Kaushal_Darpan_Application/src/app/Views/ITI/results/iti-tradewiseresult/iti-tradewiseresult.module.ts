import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiTradeWiseResultRoutingModule } from './iti-tradewiseresult-routing.module';
import { ItiTradeWiseResultComponent } from './iti-tradewiseresult.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { routes } from '../../../../routes';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ItiTradeWiseResultComponent
  ],
  imports: [
    CommonModule,
    ItiTradeWiseResultRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ItiTradeWiseResultModule { }











