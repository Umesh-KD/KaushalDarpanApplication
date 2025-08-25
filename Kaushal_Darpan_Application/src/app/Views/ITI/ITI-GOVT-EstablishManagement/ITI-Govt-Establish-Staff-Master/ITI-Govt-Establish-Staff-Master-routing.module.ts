import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIGovtEstablishStaffMasterComponent } from './ITI-Govt-Establish-Staff-Master.component';

const routes: Routes = [{ path: '', component: ITIGovtEstablishStaffMasterComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ITIGovtEstablishStaffMasterRoutingModule { }
