import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  public ProfileLists: any = {};

  ngOnInit() {
    this.ProfileLists = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }
}
