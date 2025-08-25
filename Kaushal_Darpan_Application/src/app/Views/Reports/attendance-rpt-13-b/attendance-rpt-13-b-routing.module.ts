import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceRpt13BComponent } from './attendance-rpt-13-b.component';

const routes: Routes = [{ path: '', component: AttendanceRpt13BComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AttendanceRpt13BRoutingModule { }
