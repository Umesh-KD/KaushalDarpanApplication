import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ExamMasterComponent } from "./exam-master.component";

const routes: Routes = [{ path: '', component: ExamMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamMasterRoutingModule { }
