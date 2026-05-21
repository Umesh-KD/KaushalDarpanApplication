import { ComponentFixture, TestBed } from '@angular/core/testing';

import { itiPendingCollegeFeeComponent } from './itiPendingCollegeFee.component';

describe('itiPendingCollegeFeeComponent', () => {
  let component: itiPendingCollegeFeeComponent;
  let fixture: ComponentFixture<itiPendingCollegeFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [itiPendingCollegeFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(itiPendingCollegeFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
