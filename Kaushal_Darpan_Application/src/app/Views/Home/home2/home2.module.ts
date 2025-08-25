import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Home2Component } from './home2.component';
import { HighchartsChartModule } from 'highcharts-angular';

const routes: Routes = [{ path: '', component: Home2Component }];

@NgModule({
  declarations: [
    Home2Component
  ],
  imports: [
    CommonModule, HighchartsChartModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule, FormsModule
  ]
})
export class Home2Module {
  
}
