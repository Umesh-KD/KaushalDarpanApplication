import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevaluationStudentComponent } from './revaluation-student.component';

describe('RevaluationStudentComponent', () => {
  let component: RevaluationStudentComponent;
  let fixture: ComponentFixture<RevaluationStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevaluationStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevaluationStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
