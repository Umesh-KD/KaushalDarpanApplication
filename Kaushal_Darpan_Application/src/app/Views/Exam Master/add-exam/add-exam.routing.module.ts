import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddExamComponent } from "./add-exam.component";

const routes: Routes = [{ path: '', component: AddExamComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddExamRoutingModule { }
