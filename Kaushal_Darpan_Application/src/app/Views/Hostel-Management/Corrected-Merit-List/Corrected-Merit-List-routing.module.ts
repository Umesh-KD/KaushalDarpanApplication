import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorrectedMeritListComponent } from './Corrected-Merit-List.component';

const routes: Routes = [{ path: '', component: CorrectedMeritListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorrectedMeritListRoutingModule { }
