import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelStudentMeritListWardenViewComponent } from './hostel-student-merit-list-warden-view.component';

describe('HostelStudentMeritListWardenViewComponent', () => {
  let component: HostelStudentMeritListWardenViewComponent;
  let fixture: ComponentFixture<HostelStudentMeritListWardenViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostelStudentMeritListWardenViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelStudentMeritListWardenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
