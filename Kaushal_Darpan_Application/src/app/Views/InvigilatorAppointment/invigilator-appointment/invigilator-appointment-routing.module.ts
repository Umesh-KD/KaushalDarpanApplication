import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvigilatorAppointmentComponent } from './invigilator-appointment.component';

const routes: Routes = [{ path: '', component: InvigilatorAppointmentComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvigilatorAppointmentRoutingModule { }
