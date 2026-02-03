import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { RouterModule, Routes } from '@angular/router';
import { cFormConsolidatedComponent } from './c-Form-Consolidated.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MaterialModule } from '../../../../material.module';

const routes: Routes = [{ path: '', component: cFormConsolidatedComponent }];

@NgModule({
  declarations: [cFormConsolidatedComponent],
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
export class cFormConsolidatedModule { }
