import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { ImportCounsellingVacanciesComponent } from './import-counselling-vacancies.component';
import { ImportCounsellingVacanciesRoutingModule } from './import-counselling-vacancies-routing.module';


@NgModule({
  declarations: [
    ImportCounsellingVacanciesComponent
  ],
  imports: [
    CommonModule,
    ImportCounsellingVacanciesRoutingModule,  
    LoaderModule,
    FormsModule, 
    TableSearchFilterModule,
    ReactiveFormsModule,
    OTPModalModule,
  ]
})
export class ImportCounsellingVacanciesModule { }
