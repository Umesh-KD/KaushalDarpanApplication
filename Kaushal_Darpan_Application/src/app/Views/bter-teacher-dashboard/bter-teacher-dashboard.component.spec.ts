import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterTeacherDashboardComponent } from './bter-teacher-dashboard.component';

describe('BterTeacherDashboardComponent', () => {
  let component: BterTeacherDashboardComponent;
  let fixture: ComponentFixture<BterTeacherDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BterTeacherDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterTeacherDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
