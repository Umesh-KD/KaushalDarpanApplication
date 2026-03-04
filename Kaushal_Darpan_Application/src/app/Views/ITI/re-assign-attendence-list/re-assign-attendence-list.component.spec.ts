import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignAttendenceListComponent } from './re-assign-attendence-list.component';

describe('ReAssignAttendenceListComponent', () => {
  let component: ReAssignAttendenceListComponent;
  let fixture: ComponentFixture<ReAssignAttendenceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReAssignAttendenceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReAssignAttendenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
