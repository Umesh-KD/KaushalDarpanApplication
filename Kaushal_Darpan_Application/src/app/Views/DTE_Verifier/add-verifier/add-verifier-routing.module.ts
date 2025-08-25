import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVerifierComponent } from './add-verifier.component';

const routes: Routes = [{ path: '', component: AddVerifierComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddVerifierRoutingModule { }
