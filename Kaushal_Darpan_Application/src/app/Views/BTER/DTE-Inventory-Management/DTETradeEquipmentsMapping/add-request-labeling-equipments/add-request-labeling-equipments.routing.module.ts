import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRequestLabelingEquipmentsComponent } from './add-request-labeling-equipments.component';


const routes: Routes = [{ path: '', component: AddRequestLabelingEquipmentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  
})
export class AddRequestLabelingEquipmentsRoutingModule { }


