import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QualificationMasterComponent } from './qualification-master.component';

const routes: Routes = [{ path: '', component: QualificationMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualificationMasterRoutingModule { }
