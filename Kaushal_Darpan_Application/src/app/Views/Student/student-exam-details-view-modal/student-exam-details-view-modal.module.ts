import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { StudentExamDetailsViewModalComponent } from './student-exam-details-view-modal.component';
import { StudentExamDetailsViewModalRoutingModule } from './student-exam-details-view-modal-routing.module';


@NgModule({
    declarations: [
        StudentExamDetailsViewModalComponent
    ],
    imports: [
        CommonModule,
        StudentExamDetailsViewModalRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        LoaderModule
    ],
  exports: [StudentExamDetailsViewModalComponent]
})
export class StudentExamDetailsViewModalModule { }
