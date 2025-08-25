import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMenuRightsComponent } from './user-menu-rights.component';

describe('UserMenuRightsComponent', () => {
  let component: UserMenuRightsComponent;
  let fixture: ComponentFixture<UserMenuRightsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserMenuRightsComponent]
    });
    fixture = TestBed.createComponent(UserMenuRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
