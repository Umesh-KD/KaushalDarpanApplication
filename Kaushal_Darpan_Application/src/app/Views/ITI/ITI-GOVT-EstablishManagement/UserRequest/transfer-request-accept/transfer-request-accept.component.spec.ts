import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferRequestAcceptComponent } from './transfer-request-accept.component';

describe('TransferRequestAcceptComponent', () => {
  let component: TransferRequestAcceptComponent;
  let fixture: ComponentFixture<TransferRequestAcceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferRequestAcceptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferRequestAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
