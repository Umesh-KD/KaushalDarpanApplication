import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EnumRole } from '../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _EnumRole = EnumRole;
  constructor(
    private routers: Router,
    private cdr: ChangeDetectorRef) {

  }
  ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.sSOLoginDataModel == null) {
      this.routers.navigate(['/login']);
    }

    this.routers.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
        this.reloadComponent();
      }
    });
  }

  reloadComponent() {
    this.cdr.detectChanges();
  }
  navigateToUrl(url: string) {
    this.routers.navigate([url]);  // Programmatically navigate
  }
}
