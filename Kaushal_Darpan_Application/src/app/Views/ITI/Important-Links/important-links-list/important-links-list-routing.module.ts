import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportantLinksListComponent } from './important-links-list.component';

const routes: Routes = [{ path: '', component: ImportantLinksListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportantLinksListRoutingModule { }
