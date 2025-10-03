import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DownloadApplicationFormComponent } from './download-application-form.component';

const routes: Routes = [{ path: '', component: DownloadApplicationFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadApplicationFormRoutingModule { }
