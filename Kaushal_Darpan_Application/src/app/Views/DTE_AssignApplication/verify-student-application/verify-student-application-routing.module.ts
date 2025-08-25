import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyStudentApplicationComponent } from './verify-student-application.component';

const routes: Routes = [{ path: '', component: VerifyStudentApplicationComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VerifyStudentApplicationRoutingModule { }
