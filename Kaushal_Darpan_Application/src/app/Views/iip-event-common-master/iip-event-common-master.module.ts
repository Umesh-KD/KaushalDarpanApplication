import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { IipEventCommonMasterComponent } from './iip-event-common-master.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: IipEventCommonMasterComponent }];

@NgModule({
  declarations: [
    IipEventCommonMasterComponent
  ],
  imports: [
    CommonModule,
     FormsModule, 
     ReactiveFormsModule, 
     LoaderModule, 
     TableSearchFilterModule,
     RouterModule.forChild(routes)
  ],

})
export class IipEventCommonMasterModule { }
