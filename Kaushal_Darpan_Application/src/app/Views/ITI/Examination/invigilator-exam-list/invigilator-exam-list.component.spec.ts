import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvigilatorExamListComponent } from './invigilator-exam-list.component';

describe('InvigilatorExamListComponent', () => {
  let component: InvigilatorExamListComponent;
  let fixture: ComponentFixture<InvigilatorExamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvigilatorExamListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvigilatorExamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
