import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BranchWiseHodComponent } from './branch-wise-hod.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MaterialModule } from '../../../../material.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';

const routes: Routes = [{ path: '', component: BranchWiseHodComponent }];

@NgModule({
  declarations: [BranchWiseHodComponent],
  imports: [
    CommonModule, MaterialModule, RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class BranchWiseHodModule { }

