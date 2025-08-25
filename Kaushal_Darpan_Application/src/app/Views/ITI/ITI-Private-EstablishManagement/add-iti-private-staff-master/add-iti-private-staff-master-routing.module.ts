import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItiPrivateStaffMasterComponent } from './add-iti-private-staff-master.component';

const routes: Routes = [{ path: '', component: AddItiPrivateStaffMasterComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddItiPrivateStaffMasterRoutingModule { }
