import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeficiencyApplicationComponent } from './deficiency-application.component';

describe('DeficiencyApplicationComponent', () => {
  let component: DeficiencyApplicationComponent;
  let fixture: ComponentFixture<DeficiencyApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeficiencyApplicationComponent]
    });
    fixture = TestBed.createComponent(DeficiencyApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
