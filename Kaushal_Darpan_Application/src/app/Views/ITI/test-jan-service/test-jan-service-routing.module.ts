import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestJanServiceComponent } from './test-jan-service.component';

const routes: Routes = [{ path: '', component: TestJanServiceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestJanServiceRoutingModule { }
