import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignAttendenceComponent } from './re-assign-attendence.component';

describe('ReAssignAttendenceComponent', () => {
  let component: ReAssignAttendenceComponent;
  let fixture: ComponentFixture<ReAssignAttendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReAssignAttendenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReAssignAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
