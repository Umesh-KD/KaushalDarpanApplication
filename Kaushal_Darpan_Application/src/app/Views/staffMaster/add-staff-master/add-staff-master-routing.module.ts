import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStaffMasterComponent } from './add-staff-master.component';

const routes: Routes = [{ path: '', component: AddStaffMasterComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddStaffMasterRoutingModule { }
