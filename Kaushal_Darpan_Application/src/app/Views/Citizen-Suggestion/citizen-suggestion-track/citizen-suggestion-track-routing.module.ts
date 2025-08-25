import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitizenSuggestionTrackComponent } from './citizen-suggestion-track.component';

const routes: Routes = [{ path: '', component: CitizenSuggestionTrackComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitizenSuggestionTrackRoutingModule { }
