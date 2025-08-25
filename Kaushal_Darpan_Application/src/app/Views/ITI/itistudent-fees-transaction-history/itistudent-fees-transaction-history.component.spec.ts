import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIStudentFeesTransactionHistoryComponent } from './itistudent-fees-transaction-history.component';

describe('ITIStudentFeesTransactionHistoryComponent', () => {
  let component: ITIStudentFeesTransactionHistoryComponent;
  let fixture: ComponentFixture<ITIStudentFeesTransactionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIStudentFeesTransactionHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIStudentFeesTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
