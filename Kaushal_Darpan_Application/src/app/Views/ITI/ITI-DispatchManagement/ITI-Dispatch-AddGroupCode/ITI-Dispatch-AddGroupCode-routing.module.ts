import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDispatchAddGroupCodeComponent } from './ITI-Dispatch-AddGroupCode.component';

const routes: Routes = [{ path: '', component: ITIDispatchAddGroupCodeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDispatchAddGroupCodeRoutingModule { }
