import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MaterialModule } from '../../material.module';
import { RosteListComponent } from './roste-list.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


const routes: Routes = [{
  path: '', component: RosteListComponent
}];


@NgModule({
  declarations: [RosteListComponent],
  imports: [
    FormsModule, ReactiveFormsModule, NgxMaterialTimepickerModule,
    CommonModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes)
  ],
  providers: [provideNativeDateAdapter()]
})
export class RosteListModule { }
