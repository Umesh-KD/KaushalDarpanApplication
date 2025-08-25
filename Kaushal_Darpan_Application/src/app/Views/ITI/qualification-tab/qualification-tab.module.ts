import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QualificationTabRoutingModule } from './qualification-tab-routing.module';
import { QualificationTabComponent } from './qualification-tab.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    QualificationTabComponent
  ],
  imports: [
    CommonModule,
    QualificationTabRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class QualificationTabModule { }
