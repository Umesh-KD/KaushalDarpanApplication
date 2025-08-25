import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffCenterObserverComponent } from './staff-center-observer.component';

const routes: Routes = [{ path: '', component: StaffCenterObserverComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StaffCenterObserverRoutingModule { }
