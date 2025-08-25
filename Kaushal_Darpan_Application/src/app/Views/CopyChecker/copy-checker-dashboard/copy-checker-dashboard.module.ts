import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableSearchFilterModule } from "../../../Pipes/table-search-filter.module";
import { LoaderModule } from "../../Shared/loader/loader.module";
import { CopyCheckerDashboardRoutingModule } from "./copy-checker-dashboard.routing.module";
import { CopyCheckerDashboardComponent } from "./copy-checker-dashboard.component";

@NgModule({
  declarations: [
    CopyCheckerDashboardComponent
  ],
  imports: [
    CommonModule,
    CopyCheckerDashboardRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ],
  exports: [CopyCheckerDashboardComponent ]
})
export class CopyCheckerDashboardModule { }
