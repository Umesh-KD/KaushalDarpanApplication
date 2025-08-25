import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyRollListPdfComponent } from './verify-roll-list-pdf.component';

describe('VerifyRollListPdfComponent', () => {
  let component: VerifyRollListPdfComponent;
  let fixture: ComponentFixture<VerifyRollListPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyRollListPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyRollListPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
