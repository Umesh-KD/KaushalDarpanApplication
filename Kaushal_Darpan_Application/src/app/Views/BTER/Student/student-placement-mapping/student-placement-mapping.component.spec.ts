import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPlacementMappingComponent } from './student-placement-mapping.component';

describe('StudentPlacementMappingComponent', () => {
  let component: StudentPlacementMappingComponent;
  let fixture: ComponentFixture<StudentPlacementMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentPlacementMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPlacementMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
