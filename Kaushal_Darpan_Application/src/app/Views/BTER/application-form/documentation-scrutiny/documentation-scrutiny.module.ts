import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentationScrutinyRoutingModule } from './documentation-scrutiny-routing.module';
import { DocumentationScrutinyComponent } from './documentation-scrutiny.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';
import { ImageErrorDirective } from '../../../../Common/image-error.directive';
import { CdkDrag } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    DocumentationScrutinyComponent    
  ],
  imports: [
    CommonModule,
    DocumentationScrutinyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(),
    StudentStatusHistoryModule,
    CdkDrag
  ]
})
export class DocumentationScrutinyModule { }
