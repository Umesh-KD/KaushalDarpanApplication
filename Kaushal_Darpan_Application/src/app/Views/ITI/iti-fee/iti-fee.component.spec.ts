import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIFeeComponent } from './iti-fee.component';

describe('ITIFeeComponent', () => {
  let component: ITIFeeComponent;
  let fixture: ComponentFixture<ITIFeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIFeeComponent]
    });
    fixture = TestBed.createComponent(ITIFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
