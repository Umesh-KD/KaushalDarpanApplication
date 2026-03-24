import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { itiNodelUserListComponent } from './iti-Nodel-User-List.component';  

const routes: Routes = [{ path: '', component: itiNodelUserListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class itiNodelUserListRoutingModule { }
