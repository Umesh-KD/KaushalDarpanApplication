import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QualificationTabComponent } from './qualification-tab.component';

const routes: Routes = [{ path: '', component: QualificationTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualificationTabRoutingModule { }
