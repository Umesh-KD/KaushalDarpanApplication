import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateAdmitcardComponent } from './generate-admitcard.component';

const routes: Routes = [{ path: '', component: GenerateAdmitcardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateAdmitcardRoutingModule { }
