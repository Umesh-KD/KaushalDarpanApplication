import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiExaminationTradeComponent } from './iti-examination-trade.component';

describe('ItiExaminationTradeComponent', () => {
  let component: ItiExaminationTradeComponent;
  let fixture: ComponentFixture<ItiExaminationTradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiExaminationTradeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiExaminationTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
