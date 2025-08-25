import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportantLinksListRoutingModule } from './important-links-list-routing.module';
import { ImportantLinksListComponent } from './important-links-list.component';


@NgModule({
  declarations: [
    ImportantLinksListComponent
  ],
  imports: [
    CommonModule,
    ImportantLinksListRoutingModule
  ]
})
export class ImportantLinksListModule { }
