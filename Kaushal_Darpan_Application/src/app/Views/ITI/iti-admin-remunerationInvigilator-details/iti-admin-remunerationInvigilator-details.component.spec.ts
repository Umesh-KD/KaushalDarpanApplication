import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiAdminremunerationInvigilatorDetailsComponent } from './iti-admin-remunerationInvigilator-details.component';

describe('ItiAppointedExaminerDetailsComponent', () => {
  let component: ItiAdminremunerationInvigilatorDetailsComponent;
  let fixture: ComponentFixture<ItiAdminremunerationInvigilatorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiAdminremunerationInvigilatorDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiAdminremunerationInvigilatorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
