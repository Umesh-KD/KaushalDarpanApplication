import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvigilatorExamListComponent } from './invigilator-exam-list.component';

describe('InvigilatorExamListComponent', () => {
  let component: InvigilatorExamListComponent;
  let fixture: ComponentFixture<InvigilatorExamListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvigilatorExamListComponent]
    });
    fixture = TestBed.createComponent(InvigilatorExamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
