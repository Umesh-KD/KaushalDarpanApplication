import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadTraineeLogsListComponent } from './upload-trainee-logs-list.component';

const routes: Routes = [{ path: '', component:UploadTraineeLogsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadTraineeLogsListRoutingModule { }
