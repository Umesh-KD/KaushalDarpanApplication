import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckPdfVerificationComponent } from './check-pdf-verification.component';

describe('CheckPdfVerificationComponent', () => {
  let component: CheckPdfVerificationComponent;
  let fixture: ComponentFixture<CheckPdfVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckPdfVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckPdfVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
