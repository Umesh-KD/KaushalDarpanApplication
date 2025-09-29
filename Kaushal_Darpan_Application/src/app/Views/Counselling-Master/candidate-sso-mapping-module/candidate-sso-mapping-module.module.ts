import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { CandidateSsoMappingModuleRoutingModule } from './candidate-sso-mapping-module-routing.module';
import { CandidateSsoMappingModuleComponent } from './candidate-sso-mapping-module.component';


@NgModule({
  declarations: [
    CandidateSsoMappingModuleComponent
  ],
  imports: [
    CommonModule,
    CandidateSsoMappingModuleRoutingModule, LoaderModule,
    FormsModule, TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class CandidateSsoMappingModuleModule { }



