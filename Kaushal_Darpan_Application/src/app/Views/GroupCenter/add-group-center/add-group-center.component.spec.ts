import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupCenterComponent } from './add-group-center.component';

describe('AddGroupCenterComponent', () => {
  let component: AddGroupCenterComponent;
  let fixture: ComponentFixture<AddGroupCenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddGroupCenterComponent]
    });
    fixture = TestBed.createComponent(AddGroupCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
