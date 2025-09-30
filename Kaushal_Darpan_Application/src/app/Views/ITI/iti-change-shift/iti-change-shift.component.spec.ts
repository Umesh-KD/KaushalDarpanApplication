import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiChangeShiftComponent } from './iti-change-shift.component';

describe('ItiChangeShiftComponent', () => {
  let component: ItiChangeShiftComponent;
  let fixture: ComponentFixture<ItiChangeShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiChangeShiftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiChangeShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
