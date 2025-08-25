import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeAdmissionSeatAllotmentComponent } from './college-admission-seat-allotment.component';

describe('CollegeAdmissionSeatAllotmentComponent', () => {
  let component: CollegeAdmissionSeatAllotmentComponent;
  let fixture: ComponentFixture<CollegeAdmissionSeatAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeAdmissionSeatAllotmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeAdmissionSeatAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
