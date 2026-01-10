import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnlockInternalMarksComponentRoutingModule } from './Unlock-Internal-Marks-routing.module';
import { UnlockInternalMarksComponent } from './Unlock-Internal-Marks.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    UnlockInternalMarksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, UnlockInternalMarksComponentRoutingModule
  ]
})
export class UnlockInternalMarksModule { }
