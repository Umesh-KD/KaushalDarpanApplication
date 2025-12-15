import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIBankGuaranteeComponent } from './ITI-BankGuarantee.component';

describe('ITIBankGuaranteeComponent', () => {
  let component: ITIBankGuaranteeComponent;
  let fixture: ComponentFixture<ITIBankGuaranteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIBankGuaranteeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIBankGuaranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
