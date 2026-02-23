import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorStatusListComponent } from './instructor-status-list.component';

describe('InstructorStatusListComponent', () => {
  let component: InstructorStatusListComponent;
  let fixture: ComponentFixture<InstructorStatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorStatusListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
