import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementShortlistedStudentsComponent } from './placement-shortlisted-students.component';

describe('PlacementShortlistedStudentsComponent', () => {
  let component: PlacementShortlistedStudentsComponent;
  let fixture: ComponentFixture<PlacementShortlistedStudentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlacementShortlistedStudentsComponent]
    });
    fixture = TestBed.createComponent(PlacementShortlistedStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
