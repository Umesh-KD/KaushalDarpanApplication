import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { BterPaperUploadComponent } from './bter-paper-upload.component';
const routes: Routes = [{ path: '', component: BterPaperUploadComponent }];

@NgModule({
  declarations: [BterPaperUploadComponent],
  imports: [
    CommonModule, MaterialModule, ReactiveFormsModule, FormsModule,
    RouterModule.forChild(routes),
    NgMultiSelectDropDownModule.forRoot(),
    ClipboardModule
  ]
})
export class BterPaperUploadModule { }
