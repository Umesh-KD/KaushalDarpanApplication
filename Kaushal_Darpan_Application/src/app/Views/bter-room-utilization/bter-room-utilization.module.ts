import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BterRoomUtilizationRoutingModule } from './bter-room-utilization-routing.module';
import { BterRoomUtilizationComponent } from './bter-room-utilization.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../material.module';
import { routes } from '../../routes';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    BterRoomUtilizationComponent
  ],
  imports: [
    CommonModule,
    BterRoomUtilizationRoutingModule,

    FormsModule, ReactiveFormsModule, NgxMaterialTimepickerModule,
    CommonModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes),
  ]
})
export class BterRoomUtilizationModule { }
