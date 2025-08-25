import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SemesterDetailsRoutingModule } from './semester-details-routing.module';
import { SemesterDetailsComponent } from './semester-details.component';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    SemesterDetailsComponent
  ],
  imports: [
    CommonModule,
    SemesterDetailsRoutingModule,
    LoaderModule
  ],
  exports: [SemesterDetailsComponent]
})
export class SemesterDetailsModule { }
