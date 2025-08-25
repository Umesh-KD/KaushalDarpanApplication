import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IDFFundDetailListRoutingModule } from './idffund-detail-list-routing.module';
import { IDFFundDetailListComponent } from './idffund-detail-list.component';


@NgModule({
  declarations: [
    IDFFundDetailListComponent
  ],
  imports: [
    CommonModule,
    IDFFundDetailListRoutingModule
  ]
})
export class IDFFundDetailListModule { }
