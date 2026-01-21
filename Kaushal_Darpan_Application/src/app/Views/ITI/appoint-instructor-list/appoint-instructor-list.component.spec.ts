import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointInstructorListComponent } from './appoint-instructor-list.component';

describe('AppointInstructorListComponent', () => {
  let component: AppointInstructorListComponent;
  let fixture: ComponentFixture<AppointInstructorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointInstructorListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointInstructorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
