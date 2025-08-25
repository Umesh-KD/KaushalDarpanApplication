import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiAdminremunerationInvigilatorlistComponent } from './iti-admin-remunerationInvigilator-list.component';

describe('ItiAppointedExaminerDetailsComponent', () => {
  let component: ItiAdminremunerationInvigilatorlistComponent;
  let fixture: ComponentFixture<ItiAdminremunerationInvigilatorlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiAdminremunerationInvigilatorlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiAdminremunerationInvigilatorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
