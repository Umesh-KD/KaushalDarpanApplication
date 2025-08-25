import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { MaterialModule } from '../../../../material.module';
import { ITImarksheetDownloadComponent } from './iti-marksheet.component';



const routes: Routes = [{ path: '', component: ITImarksheetDownloadComponent }];
@NgModule({
  declarations: [
    ITImarksheetDownloadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class ITImarksheetDownloadModule { }
