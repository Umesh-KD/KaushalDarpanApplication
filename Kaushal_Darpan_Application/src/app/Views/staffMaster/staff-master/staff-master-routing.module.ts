import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffMasterComponent } from './staff-master.component';

const routes: Routes = [{ path: '', component: StaffMasterComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StaffMasterRoutingModule { }
