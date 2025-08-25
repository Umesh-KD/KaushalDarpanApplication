import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItiPaperUploadComponent } from './iti-paper-upload.component';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ClipboardModule } from '@angular/cdk/clipboard';
const routes: Routes = [{ path: '', component: ItiPaperUploadComponent }];

@NgModule({
  declarations: [ItiPaperUploadComponent],
  imports:
    [
    CommonModule, MaterialModule, ReactiveFormsModule, FormsModule,
    RouterModule.forChild(routes),
    NgMultiSelectDropDownModule.forRoot(),
    ClipboardModule
  ]
})
export class ItiPaperUploadModule { }
