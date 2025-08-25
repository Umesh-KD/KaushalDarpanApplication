import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableSearchFilterModule } from "../../../Pipes/table-search-filter.module";
import { LoaderModule } from "../../Shared/loader/loader.module";
import { AddRoomsComponent } from "./add-rooms.component";
import { AddRoomsRoutingModule } from "./add-rooms.routing.module";

@NgModule({
  declarations: [
    AddRoomsComponent
  ],
  imports: [
    CommonModule,
    AddRoomsRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class AddRoomsModule { }
