import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiTradeWiseResultComponent } from './iti-tradewiseresult.component';

describe('ItiCertificateComponent', () => {
  let component: ItiTradeWiseResultComponent;
  let fixture: ComponentFixture<ItiTradeWiseResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiTradeWiseResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiTradeWiseResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
