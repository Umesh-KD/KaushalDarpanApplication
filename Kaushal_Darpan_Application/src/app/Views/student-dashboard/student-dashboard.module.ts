import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { PendingFeesComponent } from '../Student/pending-fees/pending-fees.component';
import { PendingFeesModule } from '../Student/pending-fees/pending-fees.module';
import { SemesterDetailsModule } from '../Student/semester-details/semester-details.module';
import { ImageErrorDirective } from '../../Common/image-error.directive';
import { ITIPendingFeesModule } from '../Student/itipending-fees/itipending-fees.module';
import { StudentDashboardComponent } from './student-dashboard.component';

@NgModule({
  declarations: [StudentDashboardComponent, ImageErrorDirective],
  imports: [
    CommonModule,
    StudentDashboardRoutingModule,
    LoaderModule,
    PendingFeesModule,
    SemesterDetailsModule, ITIPendingFeesModule
   
  ], exports: [StudentDashboardComponent]
  
})
export class StudentDashboardModule
{
  
}




