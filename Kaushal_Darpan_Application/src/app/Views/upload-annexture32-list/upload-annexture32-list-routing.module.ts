import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadAnnexture32ListComponent } from './upload-annexture32-list.component';

const routes: Routes = [{ path: '', component: UploadAnnexture32ListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadAnnexture32ListRoutingModule { }
