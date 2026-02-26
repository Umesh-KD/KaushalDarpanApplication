import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiSetCalenderComponent } from './iti-set-calender.component';

describe('ItiSetCalenderComponent', () => {
  let component: ItiSetCalenderComponent;
  let fixture: ComponentFixture<ItiSetCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiSetCalenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiSetCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
