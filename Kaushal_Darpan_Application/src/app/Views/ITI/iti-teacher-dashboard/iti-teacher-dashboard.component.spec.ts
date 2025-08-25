import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITITeacherDashboardComponent } from './iti-teacher-dashboard.component';

describe('ITITeacherDashboardComponent', () => {
  let component: ITITeacherDashboardComponent;
  let fixture: ComponentFixture<ITITeacherDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITITeacherDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITITeacherDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
