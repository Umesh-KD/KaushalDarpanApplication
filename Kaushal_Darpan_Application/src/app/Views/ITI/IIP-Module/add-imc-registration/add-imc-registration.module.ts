import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MaterialModule } from '../../../../material.module';
import { AddItiIMCRegistrationComponent } from './add-imc-registration.component';
import { AddItiIMCRegistrationRoutingModule } from './add-imc-registration-routing.module';



@NgModule({
  declarations: [
    AddItiIMCRegistrationComponent
  ],
  imports: [
    CommonModule,
    AddItiIMCRegistrationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AddItiIMCRegistrationModule { }
