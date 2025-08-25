import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItiIMCRegistrationComponent } from './add-imc-registration.component';

const routes: Routes = [{ path: '', component: AddItiIMCRegistrationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddItiIMCRegistrationRoutingModule { }
