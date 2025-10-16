import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditQualificationListComponent } from './edit-qualification-list.component';

const routes: Routes = [{ path: '', component: EditQualificationListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditQualificationListRoutingModule { }
