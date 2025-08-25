import { Component, OnInit } from '@angular/core';
import { SSOLandingDataDataModel, SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
  standalone: true
})
export class PageNotFoundComponent implements OnInit {
  IsLogin: boolean = false;
  public sSOLoginDataModel: SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  ngOnInit() {
    if (this.sSOLoginDataModel && this.sSOLoginDataModel.RoleID > 0) {
      this.IsLogin = true;
    }
  }
 
}
