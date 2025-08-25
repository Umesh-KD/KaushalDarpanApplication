import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItiInvigilatorComponent } from './add-iti-invigilator.component';

const routes: Routes = [{ path: '', component: AddItiInvigilatorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddItiInvigilatorRoutingModule { }
