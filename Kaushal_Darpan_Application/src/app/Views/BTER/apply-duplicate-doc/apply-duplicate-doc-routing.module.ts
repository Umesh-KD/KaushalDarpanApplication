import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplyDuplicateDocComponent } from './apply-duplicate-doc.component';

const routes: Routes = [{ path: '', component: ApplyDuplicateDocComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplyDuplicateDocRoutingModule { }
