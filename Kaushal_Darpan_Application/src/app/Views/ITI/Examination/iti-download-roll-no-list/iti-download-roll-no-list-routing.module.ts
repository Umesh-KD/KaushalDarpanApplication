import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDownloadRollNoListComponent } from './iti-download-roll-no-list.component';

const routes: Routes = [{ path: '', component: ITIDownloadRollNoListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDownloadRollNoListRoutingModule { }
