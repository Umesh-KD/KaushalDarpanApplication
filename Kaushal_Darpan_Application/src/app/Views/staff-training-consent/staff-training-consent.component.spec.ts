import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffTrainingConsentComponent } from './staff-training-consent.component';

describe('StaffTrainingConsentComponent', () => {
  let component: StaffTrainingConsentComponent;
  let fixture: ComponentFixture<StaffTrainingConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffTrainingConsentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffTrainingConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
