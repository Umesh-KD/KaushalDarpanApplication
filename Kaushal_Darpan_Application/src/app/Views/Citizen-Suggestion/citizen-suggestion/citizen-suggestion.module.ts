import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitizenSuggestionRoutingModule } from './citizen-suggestion-routing.module';
import { CitizenSuggestionComponent } from './citizen-suggestion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    CitizenSuggestionComponent,
  ],
  imports: [
    CommonModule,
    CitizenSuggestionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class CitizenSuggestionModule { }
