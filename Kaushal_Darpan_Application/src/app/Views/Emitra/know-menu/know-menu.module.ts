import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KnowMenuRoutingModule } from './know-menu-routing.module';
import { KnowMenuComponent } from './know-menu.component';


@NgModule({
  declarations: [
    KnowMenuComponent
  ],
  imports: [
    CommonModule,
    KnowMenuRoutingModule
  ]
})
export class KnowMenuModule { }
