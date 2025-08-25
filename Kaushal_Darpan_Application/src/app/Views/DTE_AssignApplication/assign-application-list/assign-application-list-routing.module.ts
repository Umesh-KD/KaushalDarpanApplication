import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignApplicationListComponent } from './assign-application-list.component';

const routes: Routes = [{ path: '', component: AssignApplicationListComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssignApplicationListRoutingModule { }
