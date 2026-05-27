import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnlockExaminerGroupcodeRevalRoutingModule } from './unlock-examiner-groupcode-reval-routing.module';
import { UnlockExaminerGroupcodeRevalComponent } from './unlock-examiner-groupcode-reval.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../material.module';
import { routes } from '../../routes';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    UnlockExaminerGroupcodeRevalComponent
  ],
  imports: [
    CommonModule,
    UnlockExaminerGroupcodeRevalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    LoaderModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class UnlockExaminerGroupcodeRevalModule { }
