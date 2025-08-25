import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableSearchFilterModule } from "../../../Pipes/table-search-filter.module";
import { LoaderModule } from "../../Shared/loader/loader.module";
import { RoomsMasterRoutingModule } from "./rooms-master.routing.module";
import { RoomsMasterComponent } from "./rooms-master.component";

@NgModule({
  declarations: [
    RoomsMasterComponent
  ],
  imports: [
    CommonModule,
    RoomsMasterRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class RoomsMasterModule { }
