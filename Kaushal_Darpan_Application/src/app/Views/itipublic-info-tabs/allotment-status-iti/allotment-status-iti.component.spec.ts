import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentStatusITIComponent } from './allotment-status-iti.component';

describe('AllotmentStatusITIComponent', () => {
  let component: AllotmentStatusITIComponent;
  let fixture: ComponentFixture<AllotmentStatusITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllotmentStatusITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotmentStatusITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
