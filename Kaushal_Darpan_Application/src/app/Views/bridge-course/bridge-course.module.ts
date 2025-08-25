import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BridgeCourseRoutingModule } from './bridge-course-routing.module';
import { BridgeCourseComponent } from './bridge-course.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterPipe } from '../../Pipes/table-search-filter.pipe';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    BridgeCourseComponent
  ],
  imports: [
    CommonModule,
    BridgeCourseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  
  ]
})
export class BridgeCourseModule { }
