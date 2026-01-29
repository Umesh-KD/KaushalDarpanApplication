import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadAnnexture32Component } from './upload-annexture32.component';

const routes: Routes = [{ path: '', component: UploadAnnexture32Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadAnnexture32RoutingModule { }
