import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipleReplyAdminRevalDispatchListComponent } from './principle-reply-admin-reval-dispatch-list.component';

const routes: Routes = [{ path: '', component: PrincipleReplyAdminRevalDispatchListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipleReplyAdminRevalDispatchListRoutingModule { }
