import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiAttendencePercentComponent } from './iti-attendence-percent.component';

describe('ItiAttendencePercentComponent', () => {
  let component: ItiAttendencePercentComponent;
  let fixture: ComponentFixture<ItiAttendencePercentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiAttendencePercentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiAttendencePercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
