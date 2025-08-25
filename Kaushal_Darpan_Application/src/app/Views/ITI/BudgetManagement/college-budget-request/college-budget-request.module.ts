import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollegeBudgetRequestRoutingModule } from './college-budget-request-routing.module';
import { CollegeBudgetRequestComponent } from './college-budget-request.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [CollegeBudgetRequestComponent], // ✅ now it's fine
  imports: [
    CommonModule,
    CollegeBudgetRequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class CollegeBudgetRequestModule { }
