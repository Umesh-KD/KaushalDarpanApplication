import { Component } from '@angular/core';

@Component({
  selector: 'app-bter-establish-management-report',
  standalone: false,
  templateUrl: './bter-establish-management-report.component.html',
  styleUrl: './bter-establish-management-report.component.css'
})
export class BterEstablishManagementReportComponent {
  async ngOnInit() {

    await this.countsLi();
  }

  async countsLi() {
    const ulElement = document.querySelector('.TreeViews  ul') as HTMLUListElement;
    const liElements = ulElement.querySelectorAll('li');
    const count = liElements.length;
    console.log(`There are ${count} <li> elements.`);

  }


  clickShowChild(event: MouseEvent): void {
    const clickedLi = (event.target as HTMLElement).closest('li');
    if (!clickedLi) {
      return;
    }
    const parentUl = clickedLi.closest('ul');
    if (!parentUl) {
      return;
    }
    const liElements = parentUl.querySelectorAll('li');
    const liCount = liElements.length;
    liElements.forEach((li: HTMLElement) => {
      li.classList.remove('ChildUlList');
    });
    if (liCount !== 0) {
      clickedLi.classList.add('ChildUlList');
    }
  }

}




