import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditQualificationComponent } from './edit-qualification.component';

const routes: Routes = [{ path: '', component: EditQualificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditQualificationRoutingModule { }
