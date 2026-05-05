import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StructuredSummaryListComponent } from './StructuredSummaryList.component';

const routes: Routes = [{ path: '', component: StructuredSummaryListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructuredSummaryListRoutingModule { }
