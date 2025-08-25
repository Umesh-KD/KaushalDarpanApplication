import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionalFormComponent } from './optional-form.component';

const routes: Routes = [{ path: '', component: OptionalFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OptionalFormRoutingModule { }
