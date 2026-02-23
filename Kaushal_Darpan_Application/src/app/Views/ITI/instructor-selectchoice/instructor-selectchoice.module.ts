import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorSelectchoiceRoutingModule } from './instructor-selectchoice-routing.module';
import { InstructorSelectchoiceComponent } from './instructor-selectchoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    InstructorSelectchoiceComponent
  ],
  imports: [
    CommonModule,
    InstructorSelectchoiceRoutingModule,
 FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ],
  exports: [InstructorSelectchoiceComponent]
})
export class InstructorSelectchoiceModule { }
