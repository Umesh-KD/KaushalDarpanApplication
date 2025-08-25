import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevaluationStudentSearchComponent } from './revaluation-student-search.component';

describe('RevaluationStudentSearchComponent', () => {
  let component: RevaluationStudentSearchComponent;
  let fixture: ComponentFixture<RevaluationStudentSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevaluationStudentSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevaluationStudentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
