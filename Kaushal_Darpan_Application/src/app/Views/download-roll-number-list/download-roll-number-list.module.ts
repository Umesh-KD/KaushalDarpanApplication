import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadRollNumberListRoutingModule } from './download-roll-number-list-routing.module';
import { DownloadRollNumberListComponent } from './download-roll-number-list.component';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    DownloadRollNumberListComponent
  ],
  imports: [
    CommonModule,
    DownloadRollNumberListRoutingModule, LoaderModule
  ]
})
export class DownloadRollNumberListModule { }
