import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIAdmitcardAndRollNoBulkGenerateComponent } from './iti-admitcard-and-roll-no-bulk-generate.component';

const routes: Routes = [{ path: '', component: ITIAdmitcardAndRollNoBulkGenerateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIAdmitcardAndRollNoBulkGenerateRoutingModule { }
