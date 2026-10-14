import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdatedSMSTemplateComponent } from './updated-sms-template.component';

const routes: Routes = [{ path: '', component: UpdatedSMSTemplateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdatedSMSTemplateRoutingModule { }
