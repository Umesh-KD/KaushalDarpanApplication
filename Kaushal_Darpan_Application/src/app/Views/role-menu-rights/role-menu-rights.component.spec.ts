import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMenuRightsComponent } from './role-menu-rights.component';

describe('RoleMenuRightsComponent', () => {
  let component: RoleMenuRightsComponent;
  let fixture: ComponentFixture<RoleMenuRightsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleMenuRightsComponent]
    });
    fixture = TestBed.createComponent(RoleMenuRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
