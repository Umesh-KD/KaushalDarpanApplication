import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUuploadComponent } from './file-uupload.component';

const routes: Routes = [{ path: '', component: FileUuploadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileUuploadRoutingModule { }
