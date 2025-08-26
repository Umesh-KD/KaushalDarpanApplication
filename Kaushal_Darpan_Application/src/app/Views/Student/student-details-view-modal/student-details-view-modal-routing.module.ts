import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDetailsViewModalComponent } from './student-details-view-modal.component';

const routes: Routes = [{ path: '', component: StudentDetailsViewModalComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentDetailsViewModalRoutingModule { }
