import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AddITIFlyingSquadComponent } from './add-iti-flying-squad/add-iti-flying-squad.component';
import { AddITITeamFlyingSquadComponent } from './add-iti-team-flying-squad/add-iti-team-flying-squad.component';
import { AddITITeamFlyingSquadAttendanceComponent } from './team-iti-flying-squad-attendance/iti-team-flying-squad-attendance.component';
import { ITIFlyingSquadReportsComponent } from './iti-flying-squad-reports/iti-flying-squad-reports.component';

const routes: Routes = [
  { path: '', component: AddITITeamFlyingSquadComponent },
  { path: 'addteam/:id/:TeamDeploymentID', component: AddITIFlyingSquadComponent },
  { path: 'team/:id', component: AddITITeamFlyingSquadAttendanceComponent },
  { path: 'reports/:id', component: ITIFlyingSquadReportsComponent }
];

@NgModule({
  declarations: [AddITIFlyingSquadComponent, AddITITeamFlyingSquadComponent, AddITITeamFlyingSquadAttendanceComponent, ITIFlyingSquadReportsComponent],
  imports: [
    CommonModule, TableSearchFilterModule, ReactiveFormsModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ITIFlyingSquadModule { }
