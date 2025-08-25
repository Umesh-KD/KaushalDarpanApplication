import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCenterComponent } from './group-center.component';

describe('GroupCenterComponent', () => {
  let component: GroupCenterComponent;
  let fixture: ComponentFixture<GroupCenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupCenterComponent]
    });
    fixture = TestBed.createComponent(GroupCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
