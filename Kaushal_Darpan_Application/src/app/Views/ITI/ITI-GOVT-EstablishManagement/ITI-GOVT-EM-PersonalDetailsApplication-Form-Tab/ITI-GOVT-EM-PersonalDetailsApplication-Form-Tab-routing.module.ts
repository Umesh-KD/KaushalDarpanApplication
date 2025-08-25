import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIGOVTEMPersonalDetailsApplicationFormTabComponent } from './ITI-GOVT-EM-PersonalDetailsApplication-Form-Tab.component';

const routes: Routes = [{ path: '', component: ITIGOVTEMPersonalDetailsApplicationFormTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIGOVTEMPersonalDetailsApplicationFormTabRoutingModule { }


