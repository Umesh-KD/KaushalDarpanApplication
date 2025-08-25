import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { RouterModule, Routes } from '@angular/router';
import { CFormComponent } from './c-form.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MaterialModule } from '../../../../material.module';

const routes: Routes = [{ path: '', component: CFormComponent }];

@NgModule({
  declarations: [CFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    RouterModule.forChild(routes),
    ScrollingModule,
    MaterialModule
  ]
})
export class CFormModule { }
