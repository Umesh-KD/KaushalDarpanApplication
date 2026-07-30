import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-application-form',
  standalone: false,
  templateUrl: './edit-application-form.component.html',
  styleUrl: './edit-application-form.component.css'
})
export class EditApplicationFormComponent {

  constructor(private router: Router) {}


  goToApplicationList() {
  this.router.navigate(['/ApplicationList']);
}
}
