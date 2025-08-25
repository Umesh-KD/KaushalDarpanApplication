import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitizenSuggestionComponent } from './citizen-suggestion.component';

const routes: Routes = [{ path: '', component: CitizenSuggestionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitizenSuggestionRoutingModule { }
