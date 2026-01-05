import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticalExamAssignedComponent } from './practical-exam-assigned.component';

describe('PracticalExamAssignedComponent', () => {
  let component: PracticalExamAssignedComponent;
  let fixture: ComponentFixture<PracticalExamAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PracticalExamAssignedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticalExamAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
