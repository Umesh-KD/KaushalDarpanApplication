import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTicketComponent } from './exam-ticket.component';

describe('ExamTicketComponent', () => {
  let component: ExamTicketComponent;
  let fixture: ComponentFixture<ExamTicketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamTicketComponent]
    });
    fixture = TestBed.createComponent(ExamTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
