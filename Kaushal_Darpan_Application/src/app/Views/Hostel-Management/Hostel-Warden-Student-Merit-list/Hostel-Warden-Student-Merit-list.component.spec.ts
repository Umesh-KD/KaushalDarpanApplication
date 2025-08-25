import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelWardenStudentMeritlistComponent } from './Hostel-Warden-Student-Merit-list.component';

describe('StudentRequestListComponent', () => {
  let component: HostelWardenStudentMeritlistComponent;
  let fixture: ComponentFixture<HostelWardenStudentMeritlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostelWardenStudentMeritlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelWardenStudentMeritlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
