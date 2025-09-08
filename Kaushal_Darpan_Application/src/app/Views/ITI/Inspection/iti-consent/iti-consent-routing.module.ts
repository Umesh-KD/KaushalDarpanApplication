import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIConsentComponent } from './iti-consent.component';

const routes: Routes = [{ path: '', component: ITIConsentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIConsentRoutingModule { }
