import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { UserMasterOfficeWiseComponent } from './user-master-office-wise.component';
import { UserMasterOfficeWiseRoutingModule } from './user-master-office-wise-routing.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    UserMasterOfficeWiseComponent
  ],
  imports: [
    CommonModule,
    UserMasterOfficeWiseRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, TableSearchFilterModule, LoaderModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class UserMasterOfficeWiseModule { }
