import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { ExaminationsReportsMenuComponent } from './examinations-reports-menu/examinations-reports-menu.component';
import { ExaminationsReportsComponent } from './examinations-reports.component';


const routes: Routes = [{ path: '', component: ExaminationsReportsComponent }];


@NgModule({
  declarations: [ExaminationsReportsComponent],
  imports: [
    ExaminationsReportsMenuComponent,
    FormsModule, 
    ReactiveFormsModule, NgSelectModule,
    CommonModule,
    LoaderModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class ExaminationsReportsModule { }
