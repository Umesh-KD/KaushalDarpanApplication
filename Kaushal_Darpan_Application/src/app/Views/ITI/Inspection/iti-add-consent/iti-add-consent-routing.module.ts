import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIAddConsentComponent } from './iti-add-consent.component';

const routes: Routes = [{ path: '', component: ITIAddConsentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIAddConsentRoutingModule { }
