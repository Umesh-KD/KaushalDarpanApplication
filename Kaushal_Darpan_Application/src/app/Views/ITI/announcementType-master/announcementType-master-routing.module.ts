import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementTypeMasterComponent } from './announcementType-master.component';

const routes: Routes = [{ path: '', component: AnnouncementTypeMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementTypeMasterRoutingModule { }
