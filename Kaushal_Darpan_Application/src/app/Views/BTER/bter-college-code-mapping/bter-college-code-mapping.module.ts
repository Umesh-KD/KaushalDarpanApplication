import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BterCollegeCodeMappingComponent } from './bter-college-code-mapping.component';
import { LoaderModule } from '../../Shared/loader/loader.module';

const routes: Routes = [{ path: '', component: BterCollegeCodeMappingComponent }];

@NgModule({
  declarations: [BterCollegeCodeMappingComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes), LoaderModule
  ]
})
export class BterCollegeCodeMappingModule { }
