import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { StudentDetailsViewModalComponent } from './student-details-view-modal.component';
import { StudentDetailsViewModalRoutingModule } from './student-details-view-modal-routing.module';


@NgModule({
    declarations: [
        StudentDetailsViewModalComponent
    ],
    imports: [
        CommonModule,
        StudentDetailsViewModalRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        LoaderModule
    ],
  exports: [StudentDetailsViewModalComponent]
})
export class StudentDetailsViewModalModule { }
