import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitizenSuggestionTrackRoutingModule } from './citizen-suggestion-track-routing.module';
import { CitizenSuggestionTrackComponent } from './citizen-suggestion-track.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [
    CitizenSuggestionTrackComponent
  ],
  imports: [
    CommonModule,
    CitizenSuggestionTrackRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class CitizenSuggestionTrackModule { }
