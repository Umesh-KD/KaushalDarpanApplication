import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStaffBasicDetailComponent } from './add-staff-basic-detail.component';

const routes: Routes = [{ path: '', component: AddStaffBasicDetailComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddStaffBasicDetailRoutingModule { }
