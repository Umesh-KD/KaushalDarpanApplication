import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIDispatchSuperintendentAllottedExamDateListComponent } from './ITI-DispatchSuperintendentAllottedExamDateList.component';

describe('QualificationFormComponent', () => {
  let component: ITIDispatchSuperintendentAllottedExamDateListComponent;
  let fixture: ComponentFixture<ITIDispatchSuperintendentAllottedExamDateListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIDispatchSuperintendentAllottedExamDateListComponent]
    });
    fixture = TestBed.createComponent(ITIDispatchSuperintendentAllottedExamDateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
