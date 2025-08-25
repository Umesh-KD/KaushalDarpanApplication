import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ITIPaperUploadedListRoutingModule } from './itipaper-uploaded-list-routing.module';
import { ITIPaperUploadedListComponent } from './itipaper-uploaded-list.component';
const routes: Routes = [{ path: '', component: ITIPaperUploadedListComponent }];


@NgModule({
  declarations: [
    ITIPaperUploadedListComponent
  ],
  imports: [
    
    ITIPaperUploadedListRoutingModule,
     CommonModule, MaterialModule, ReactiveFormsModule, FormsModule,
    RouterModule.forChild(routes),
    NgMultiSelectDropDownModule.forRoot(),
    ClipboardModule
  ]
})
export class ITIPaperUploadedListModule { }
