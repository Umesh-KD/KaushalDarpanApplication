import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { PendingFeesComponent } from '../Student/pending-fees/pending-fees.component';
import { PendingFeesModule } from '../Student/pending-fees/pending-fees.module';
import { StudentCenteredActivitesMasterComponent } from './student-centered-activites-master.component';
import { StudentCenteredActivitesRoutingModule } from './student-centered-activites-routing.module';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterPipe } from '../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [StudentCenteredActivitesMasterComponent],
  imports: [
    CommonModule,
    StudentCenteredActivitesRoutingModule,
    LoaderModule,
    PendingFeesModule,
    FormsModule,
    TableSearchFilterModule
  ], exports: [StudentCenteredActivitesMasterComponent]
  
})
export class StudentCenteredActivitesModule
{
  
}




