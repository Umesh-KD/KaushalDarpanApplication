import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ApproveCompanyEventComponent } from './approve-company-event.component';
import { ApproveCompanyEventRoutingModule } from './approve-company-event-routing.module';

@NgModule({
  declarations: [
    ApproveCompanyEventComponent
  ],
  imports: [
    CommonModule,
    ApproveCompanyEventRoutingModule,
     FormsModule, 
     ReactiveFormsModule,  
     LoaderModule, 
     TableSearchFilterModule
  ]
})
export class ApproveCompanyEventModule { }
