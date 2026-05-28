import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IIPEventConsentListComponent } from './iip-event-consent-list.component';

const routes: Routes = [{ path: '', component: IIPEventConsentListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IIPEventConsentListRoutingModule { }
