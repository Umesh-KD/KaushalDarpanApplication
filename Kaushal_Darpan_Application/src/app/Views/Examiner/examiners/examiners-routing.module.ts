import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExaminersComponent } from './examiners.component';

const routes: Routes = [{ path: '', component: ExaminersComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExaminersRoutingModule { }
