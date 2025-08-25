import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignedApplicationsComponent } from './assigned-applications.component';

const routes: Routes = [{ path: '', component: AssignedApplicationsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssignedApplicationsRoutingModule { }
