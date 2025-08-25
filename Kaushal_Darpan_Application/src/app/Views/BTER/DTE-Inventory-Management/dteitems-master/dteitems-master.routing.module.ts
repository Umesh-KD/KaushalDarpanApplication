import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DteItemsMasterComponent } from './dteitems-master.component';


const routes: Routes = [{ path: '', component: DteItemsMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DteItemsMasterRoutingModule { }


