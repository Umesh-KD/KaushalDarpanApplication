import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevalExaminersComponent } from './reval-examiners.component';

const routes: Routes = [{ path: '', component: RevalExaminersComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RevalExaminersRoutingModule { }
