import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ExamMasterComponent } from "./exam-master.component";
import { ExamMasterRoutingModule } from "./exam-master.routing.module";
import { TableSearchFilterModule } from "../../../Pipes/table-search-filter.module";
import { LoaderModule } from "../../Shared/loader/loader.module";

@NgModule({
  declarations: [
    ExamMasterComponent
  ],
  imports: [
    CommonModule,
    ExamMasterRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ExamMasterModule { }
