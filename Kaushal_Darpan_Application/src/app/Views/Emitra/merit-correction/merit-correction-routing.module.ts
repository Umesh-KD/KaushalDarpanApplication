import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorrectionMeritComponent } from './merit-correction.component';

const routes: Routes = [{ path: '', component: CorrectionMeritComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorrectionMeritRoutingModule { }
