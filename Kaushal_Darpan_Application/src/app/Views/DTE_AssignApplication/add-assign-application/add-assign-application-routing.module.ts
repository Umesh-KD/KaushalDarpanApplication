import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAssignApplicationComponent } from './add-assign-application.component';

const routes: Routes = [{ path: '', component: AddAssignApplicationComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddAssignApplicationRoutingModule { }
