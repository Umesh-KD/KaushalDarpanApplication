import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIConsentUpdateComponent } from './iti-consent-update.component';

const routes: Routes = [{ path: '', component: ITIConsentUpdateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIConsentUpdateRoutingModule { }
