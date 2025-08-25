import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { BranchSectionCreateComponent } from './branch-section-create.component';
import { MaterialModule } from '../../../../material.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';

const routes: Routes = [{ path: '', component: BranchSectionCreateComponent }];

@NgModule({
  declarations: [BranchSectionCreateComponent],
  imports: [
    CommonModule, MaterialModule, RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class BranchSectionCreateModule { }
