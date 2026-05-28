import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IipEventConsentListPublicComponent } from './iip-event-consent-list-public.component';

const routes: Routes = [{ path: '', component: IipEventConsentListPublicComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IipEventConsentListPublicRoutingModule { }
