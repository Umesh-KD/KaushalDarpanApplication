import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditOptionFormComponent } from './edit-option-form.component';

const routes: Routes = [{ path: '', component: EditOptionFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditOptionFormRoutingModule { }
