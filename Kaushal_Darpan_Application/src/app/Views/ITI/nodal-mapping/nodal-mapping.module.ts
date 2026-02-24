import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NodalMappingRoutingModule } from './nodal-mapping-routing.module';
import { NodalMappingComponent } from './nodal-mapping.component';


@NgModule({
  declarations: [
    NodalMappingComponent
  ],
  imports: [
    CommonModule,
    NodalMappingRoutingModule
  ]
})
export class NodalMappingModule { }
