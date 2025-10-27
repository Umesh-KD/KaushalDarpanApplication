import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQualificationListComponent } from './add-qualification-list.component';

const routes: Routes = [{ path: '', component: AddQualificationListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddQualificationListRoutingModule { }
