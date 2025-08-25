import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentUpgradedByUpwardComponent } from './students-upgraded-by-upward.component';

describe('StudentUpgradedByUpwardComponent', () => {
  let component: StudentUpgradedByUpwardComponent;
  let fixture: ComponentFixture<StudentUpgradedByUpwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentUpgradedByUpwardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentUpgradedByUpwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
