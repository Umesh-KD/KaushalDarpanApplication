import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPapersMasterRoutingModule } from './add-papers-master-routing.module';
import { AddPapersMasterComponent } from './add-papers-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddPapersMasterComponent
  ],
  imports: [
    CommonModule,
    AddPapersMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgSelectModule

    
  ]
})
export class AddPapersMasterModule { }
