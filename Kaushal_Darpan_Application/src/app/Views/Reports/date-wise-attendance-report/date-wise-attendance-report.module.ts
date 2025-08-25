import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { DateWiseAttendanceReportComponent } from './date-wise-attendance-report.component';



const routes: Routes = [{ path: '', component: DateWiseAttendanceReportComponent }];


@NgModule({
  declarations: [DateWiseAttendanceReportComponent],
  imports: [
    FormsModule, ReactiveFormsModule,
    CommonModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes),
    MaterialModule
    
  ], providers: [DatePipe]
})
export class DateWiseAttendanceReportModule { }
