import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnlockInternalMarksComponent } from './Unlock-Internal-Marks.component';

const routes: Routes = [{ path: '', component: UnlockInternalMarksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnlockInternalMarksComponentRoutingModule { }
