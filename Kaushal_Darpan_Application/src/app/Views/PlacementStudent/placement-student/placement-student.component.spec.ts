import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementStudentComponent } from './placement-student.component';

describe('PlacementStudentComponent', () => {
  let component: PlacementStudentComponent;
  let fixture: ComponentFixture<PlacementStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlacementStudentComponent]
    });
    fixture = TestBed.createComponent(PlacementStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
