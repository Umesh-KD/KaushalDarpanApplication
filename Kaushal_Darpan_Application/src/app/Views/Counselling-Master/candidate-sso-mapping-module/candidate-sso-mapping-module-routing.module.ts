import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateSsoMappingModuleComponent } from './candidate-sso-mapping-module.component';

const routes: Routes = [{ path: '', component: CandidateSsoMappingModuleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateSsoMappingModuleRoutingModule { }
