import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentSettingComponent } from './document-setting.component';

const routes: Routes = [{ path: '', component: DocumentSettingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentSettingRoutingModule { }
