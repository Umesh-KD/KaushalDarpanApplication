import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MaterialModule } from '../../../../material.module';
import { AddItiCenterObserverComponent } from './add-iti-center-observer.component';
import { AddItiCenterObserverRoutingModule } from './add-iti-center-observer-routing.module';



@NgModule({
  declarations: [
    AddItiCenterObserverComponent
  ],
  imports: [
    CommonModule,
    AddItiCenterObserverRoutingModule,
    LoaderModule,
    TableSearchFilterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class AddItiCenterObserverModule { }
