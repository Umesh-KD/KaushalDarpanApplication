import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { BterDuplicateCertificateComponent } from './bter-duplicate-certificate.component';

const routes: Routes = [{ path: '', component: BterDuplicateCertificateComponent }];

@NgModule({
  declarations: [BterDuplicateCertificateComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule, NgSelectModule,
    CommonModule,
    LoaderModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class BterDuplicateCertificateModule { }
