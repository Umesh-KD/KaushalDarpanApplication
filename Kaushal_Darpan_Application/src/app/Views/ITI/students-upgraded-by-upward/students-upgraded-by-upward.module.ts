import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentUpgradedByUpwardRoutingModule } from './students-upgraded-by-upward-routing.module';
import { StudentUpgradedByUpwardComponent } from './students-upgraded-by-upward.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    StudentUpgradedByUpwardComponent
  ],
  imports: [
    CommonModule,
   StudentUpgradedByUpwardRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule,

  ]
})
export class StudentUpgradedByUpwardModule { }
