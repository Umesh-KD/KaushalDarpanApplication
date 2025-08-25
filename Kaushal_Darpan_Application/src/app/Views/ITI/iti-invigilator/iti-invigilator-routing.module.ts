import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiInvigilatorComponent } from './iti-invigilator.component';

const routes: Routes = [{ path: '', component: ItiInvigilatorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiInvigilatorRoutingModule { }
