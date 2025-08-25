import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { RoleMasterComponent } from './role-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { CenterAllotmentComponent } from './center-allotment.component';



//import { DesignationMasterComponent } from './designation-master.component';
const routes: Routes = [
  {
    path: '',
    component: CenterAllotmentComponent
  }
];

@NgModule({
  declarations: [
    CenterAllotmentComponent

  ],

  imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, CommonModule, TableSearchFilterModule, LoaderModule],
  exports: [RouterModule],
})


export class CenterAllotmentRoutingModule { }
