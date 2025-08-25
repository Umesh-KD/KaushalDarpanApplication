import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIDownloadRollNoListRoutingModule } from './iti-download-roll-no-list-routing.module';
import { ITIDownloadRollNoListComponent } from './iti-download-roll-no-list.component';


@NgModule({
  declarations: [
    ITIDownloadRollNoListComponent
  ],
  imports: [
    CommonModule,
    ITIDownloadRollNoListRoutingModule
  ]
})
export class ITIDownloadRollNoListModule { }
