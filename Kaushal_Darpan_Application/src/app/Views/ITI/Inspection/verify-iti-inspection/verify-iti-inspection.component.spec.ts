import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyITIInspectionComponent } from './verify-iti-inspection.component';

describe('VerifyITIInspectionComponent', () => {
  let component: VerifyITIInspectionComponent;
  let fixture: ComponentFixture<VerifyITIInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyITIInspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyITIInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
