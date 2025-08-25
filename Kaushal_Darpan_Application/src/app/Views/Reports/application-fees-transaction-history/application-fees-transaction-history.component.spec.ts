import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFeesTransactionHistoryComponent } from './application-fees-transaction-history.component';

describe('ApplicationFeesTransactionHistoryComponent', () => {
  let component: ApplicationFeesTransactionHistoryComponent;
  let fixture: ComponentFixture<ApplicationFeesTransactionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationFeesTransactionHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationFeesTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
