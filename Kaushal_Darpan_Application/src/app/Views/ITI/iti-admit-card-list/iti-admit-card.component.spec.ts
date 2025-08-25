import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAdmitCardComponent } from './iti-admit-card.component';

describe('VerifyAdmitCardComponent', () => {
  let component: VerifyAdmitCardComponent;
  let fixture: ComponentFixture<VerifyAdmitCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyAdmitCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyAdmitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
