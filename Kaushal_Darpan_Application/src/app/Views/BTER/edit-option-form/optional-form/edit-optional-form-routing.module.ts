import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditOptionalFormComponent } from './edit-optional-form.component';

const routes: Routes = [{ path: '', component: EditOptionalFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditOptionalFormRoutingModule { }
