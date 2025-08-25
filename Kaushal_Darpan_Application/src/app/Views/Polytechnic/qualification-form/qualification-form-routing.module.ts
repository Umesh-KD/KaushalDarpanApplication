import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QualificationFormComponent } from './qualification-form.component';

const routes: Routes = [{ path: '', component: QualificationFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualificationFormRoutingModule { }
