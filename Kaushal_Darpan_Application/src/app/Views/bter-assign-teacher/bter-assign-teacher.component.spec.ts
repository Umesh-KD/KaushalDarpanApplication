import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterAssignTeacherComponent } from './bter-assign-teacher.component';

describe('BterAssignTeacherComponent', () => {
  let component: BterAssignTeacherComponent;
  let fixture: ComponentFixture<BterAssignTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BterAssignTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterAssignTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
