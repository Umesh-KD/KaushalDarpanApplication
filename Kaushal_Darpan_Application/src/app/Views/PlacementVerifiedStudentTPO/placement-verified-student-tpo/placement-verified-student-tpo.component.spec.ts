import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementVerifiedStudentTpoComponent } from './placement-verified-student-tpo.component';

describe('PlacementVerifiedStudentTpoComponent', () => {
  let component: PlacementVerifiedStudentTpoComponent;
  let fixture: ComponentFixture<PlacementVerifiedStudentTpoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlacementVerifiedStudentTpoComponent]
    });
    fixture = TestBed.createComponent(PlacementVerifiedStudentTpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
