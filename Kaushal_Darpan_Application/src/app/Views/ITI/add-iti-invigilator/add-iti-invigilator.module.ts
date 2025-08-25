import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddItiInvigilatorRoutingModule } from './add-iti-invigilator-routing.module';
import { AddItiInvigilatorComponent } from './add-iti-invigilator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    AddItiInvigilatorComponent
  ],
  imports: [
    CommonModule,
    AddItiInvigilatorRoutingModule,
    ReactiveFormsModule, FormsModule, TableSearchFilterModule
  ],
  exports: [AddItiInvigilatorComponent]
})
export class AddItiInvigilatorModule { }
