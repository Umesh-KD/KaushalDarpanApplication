import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentExamDetailsViewModalComponent } from './student-exam-details-view-modal.component';

const routes: Routes = [{ path: '', component: StudentExamDetailsViewModalComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentExamDetailsViewModalRoutingModule { }
