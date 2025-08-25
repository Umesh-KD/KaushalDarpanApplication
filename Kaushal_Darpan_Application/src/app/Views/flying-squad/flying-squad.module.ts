import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { AddFlyingSquadComponent } from './add-flying-squad/add-flying-squad.component';
import { AddTeamFlyingSquadComponent } from './add-team-flying-squad/add-team-flying-squad.component';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { AddTeamFlyingSquadAttendanceComponent } from './team-flying-squad-attendance/team-flying-squad-attendance.component';
import { CdkDrag } from '@angular/cdk/drag-drop';

const routes: Routes = [
  { path: '', component: AddTeamFlyingSquadComponent },
  { path: 'addteam', component: AddFlyingSquadComponent },
  { path: 'team/:id', component: AddTeamFlyingSquadAttendanceComponent }
];

@NgModule({
  declarations: [AddFlyingSquadComponent, AddTeamFlyingSquadComponent, AddTeamFlyingSquadAttendanceComponent],
  imports: [CdkDrag,
    CommonModule, TableSearchFilterModule, ReactiveFormsModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class FlyingSquadModule { }
