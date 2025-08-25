import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableSearchFilterModule } from "../../../Pipes/table-search-filter.module";
import { LoaderModule } from "../../Shared/loader/loader.module";
import { AddExamComponent } from "./add-exam.component";
import { AddExamRoutingModule } from "./add-exam.routing.module";

@NgModule({
  declarations: [
    AddExamComponent
  ],
  imports: [
    CommonModule,
    AddExamRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class AddExamModule { }
