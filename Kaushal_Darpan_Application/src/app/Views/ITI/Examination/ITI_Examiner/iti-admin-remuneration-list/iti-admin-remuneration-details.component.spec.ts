import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiAdminRemunerationDetailsComponent } from './iti-admin-remuneration-details.component';

describe('ItiAppointedExaminerDetailsComponent', () => {
  let component: ItiAdminRemunerationDetailsComponent;
  let fixture: ComponentFixture<ItiAdminRemunerationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiAdminRemunerationDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiAdminRemunerationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
