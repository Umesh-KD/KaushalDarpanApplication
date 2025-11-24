import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateStudentQualificationRoutingModule } from './update-student-qualification-routing.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { PendingFeesComponent } from '../../Student/pending-fees/pending-fees.component';
import { PendingFeesModule } from '../../Student/pending-fees/pending-fees.module';
import { SemesterDetailsModule } from '../../Student/semester-details/semester-details.module';
import { ImageErrorDirective } from '../../../Common/image-error.directive';
import { ITIPendingFeesModule } from '../../Student/itipending-fees/itipending-fees.module';
import { UpdateStudentQualificationComponent } from './update-student-qualification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UpdateStudentQualificationComponent],
  imports: [
    CommonModule,
    UpdateStudentQualificationRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    PendingFeesModule,
    SemesterDetailsModule, ITIPendingFeesModule
   
  ], exports: [UpdateStudentQualificationComponent]
  
})
export class UpdateStudentQualificationModule
{
  
}




