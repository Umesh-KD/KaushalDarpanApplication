import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnlockApplicationFormComponent } from './unlock-application-form.component';

const routes: Routes = [{ path: '', component: UnlockApplicationFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnlockApplicationFormRoutingModule { }
