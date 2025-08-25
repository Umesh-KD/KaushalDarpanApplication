import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

import { ITIGovtPrincipalMultipleInstituteAlloatListComponent } from './ITI-Govt-Principal-Multiple-Institute-AlloatList.component';
import { ITIGovtPrincipalMultipleInstituteAlloatListRoutingModule } from './ITI-Govt-Principal-Multiple-Institute-AlloatList-routing.module';



@NgModule({
  declarations: [
    ITIGovtPrincipalMultipleInstituteAlloatListComponent
  ],
  imports: [
    CommonModule,
    ITIGovtPrincipalMultipleInstituteAlloatListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  
  ]
})
export class ITIGovtPrincipalMultipleInstituteAlloatListModule { }
