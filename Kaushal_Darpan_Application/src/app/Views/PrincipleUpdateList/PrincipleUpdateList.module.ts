import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterPipe } from '../../Pipes/table-search-filter.pipe';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

import { PrincipleUpdateListComponent } from './PrincipleUpdateList.component';
import { PrincipleListRoutingModule } from './PrincipleUpdateList-routing.module';



@NgModule({
  declarations: [
    PrincipleUpdateListComponent
  ],
  imports: [
    CommonModule,
    PrincipleListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  
  ]
})
export class PrincipleListModule { }
