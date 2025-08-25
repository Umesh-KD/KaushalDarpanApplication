import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MaterialModule } from '../../../../material.module';
import { ItiCenterObserverComponent } from './iti-center-observer.component';
import { ItiCenterObserverRoutingModule } from './iti-center-observer-routing.module';



@NgModule({
  declarations: [
    ItiCenterObserverComponent
  ],
  imports: [
    CommonModule,
    ItiCenterObserverRoutingModule,
    LoaderModule,
    TableSearchFilterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class ItiCenterObserverModule { }
