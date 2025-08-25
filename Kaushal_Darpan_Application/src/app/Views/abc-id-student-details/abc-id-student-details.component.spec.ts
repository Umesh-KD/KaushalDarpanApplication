import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbcIdStudentDetailsComponent } from './abc-id-student-details.component';

describe('AbcIdStudentDetailsComponent', () => {
  let component: AbcIdStudentDetailsComponent;
  let fixture: ComponentFixture<AbcIdStudentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbcIdStudentDetailsComponent]
    });
    fixture = TestBed.createComponent(AbcIdStudentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
