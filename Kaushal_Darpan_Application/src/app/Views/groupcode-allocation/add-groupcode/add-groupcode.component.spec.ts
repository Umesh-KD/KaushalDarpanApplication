import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupcodeAddComponent } from './add-groupcode.component';

describe('GroupcodeAddComponent', () => {
  let component: GroupcodeAddComponent;
  let fixture: ComponentFixture<GroupcodeAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupcodeAddComponent]
    });
    fixture = TestBed.createComponent(GroupcodeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
