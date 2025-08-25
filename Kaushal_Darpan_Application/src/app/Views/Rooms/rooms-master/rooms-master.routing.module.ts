import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoomsMasterComponent } from "./rooms-master.component";

const routes: Routes = [{ path: '', component: RoomsMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomsMasterRoutingModule { }
