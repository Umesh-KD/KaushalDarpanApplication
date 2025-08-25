import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiExaminerDashboardComponent } from './iti-examiner-dashboard.component';

describe('ItiExaminerDashboardComponent', () => {
  let component: ItiExaminerDashboardComponent;
  let fixture: ComponentFixture<ItiExaminerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiExaminerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiExaminerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
