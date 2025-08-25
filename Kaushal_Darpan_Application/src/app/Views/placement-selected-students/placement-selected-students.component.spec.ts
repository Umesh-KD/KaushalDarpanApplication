import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementSelectedStudentsComponent } from './placement-selected-students.component';

describe('PlacementSelectedStudentsComponent', () => {
  let component: PlacementSelectedStudentsComponent;
  let fixture: ComponentFixture<PlacementSelectedStudentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlacementSelectedStudentsComponent]
    });
    fixture = TestBed.createComponent(PlacementSelectedStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
