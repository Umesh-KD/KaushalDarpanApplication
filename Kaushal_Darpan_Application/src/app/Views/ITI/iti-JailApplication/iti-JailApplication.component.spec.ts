import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiApplicationComponent } from './iti-application.component';

describe('ItiApplicationComponent', () => {
  let component: ItiApplicationComponent;
  let fixture: ComponentFixture<ItiApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItiApplicationComponent]
    });
    fixture = TestBed.createComponent(ItiApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
