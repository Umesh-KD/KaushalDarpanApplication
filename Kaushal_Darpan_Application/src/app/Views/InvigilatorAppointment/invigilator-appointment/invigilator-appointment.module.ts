import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { InvigilatorAppointmentComponent } from './invigilator-appointment.component';
import { InvigilatorAppointmentRoutingModule } from './invigilator-appointment-routing.module';



@NgModule({
    declarations: [
        InvigilatorAppointmentComponent
    ],
    imports: [
        CommonModule,
        InvigilatorAppointmentRoutingModule,
        FormsModule,
        LoaderModule,
        ReactiveFormsModule
    ]
})
export class InvigilatorAppointmentModule { }
