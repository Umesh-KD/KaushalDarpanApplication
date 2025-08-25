import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssignApplicationComponent } from './add-assign-application.component';

describe('AddAssignApplicationComponent', () => {
  let component: AddAssignApplicationComponent;
  let fixture: ComponentFixture<AddAssignApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAssignApplicationComponent]
    });
    fixture = TestBed.createComponent(AddAssignApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
