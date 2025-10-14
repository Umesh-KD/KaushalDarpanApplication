import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadNcvtDataComponent } from './upload-ncvt-data.component';

const routes: Routes = [{ path: '', component: UploadNcvtDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadNcvtDataRoutingModule { }
