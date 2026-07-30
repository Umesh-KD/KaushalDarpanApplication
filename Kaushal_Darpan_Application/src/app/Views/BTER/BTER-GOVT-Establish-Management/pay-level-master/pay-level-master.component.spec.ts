import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayLevelMasterComponent } from './pay-level-master.component';

describe('PayLevelMasterComponent', () => {
  let component: PayLevelMasterComponent;
  let fixture: ComponentFixture<PayLevelMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayLevelMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayLevelMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
