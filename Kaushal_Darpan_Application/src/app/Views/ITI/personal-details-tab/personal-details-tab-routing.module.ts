import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalDetailsTabComponent } from './personal-details-tab.component';

const routes: Routes = [{ path: '', component: PersonalDetailsTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalDetailsTabRoutingModule { }
