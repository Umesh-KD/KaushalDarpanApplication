import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdatedEmailTemplateComponent } from './updated-email-template.component';

const routes: Routes = [{ path: '', component: UpdatedEmailTemplateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdatedEmailTemplateRoutingModule { }
