import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateRollnumberITIComponent } from './generate-rollnumber-iti.component';

const routes: Routes = [{ path: '', component: GenerateRollnumberITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateRollnumberITIRoutingModule { }
