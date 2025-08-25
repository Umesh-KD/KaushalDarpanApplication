import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ITIRegistrarDashboardComponent } from './iti-registrar-dashboard.component';

const routes: Routes = [{ path: '', component: ITIRegistrarDashboardComponent }];

@NgModule({
  declarations: [
    ITIRegistrarDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ITIRegistrarDashboardComponent]
})
export class ITIRegistrarDashboardModule { }
