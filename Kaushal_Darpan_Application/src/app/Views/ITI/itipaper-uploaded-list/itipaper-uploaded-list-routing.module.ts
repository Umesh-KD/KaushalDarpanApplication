import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIPaperUploadedListComponent } from './itipaper-uploaded-list.component';

const routes: Routes = [{ path: '', component: ITIPaperUploadedListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIPaperUploadedListRoutingModule { }
