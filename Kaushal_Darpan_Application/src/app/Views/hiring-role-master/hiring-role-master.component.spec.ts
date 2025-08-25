import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringRoleMasterComponent } from './hiring-role-master.component';

describe('HiringRoleMasterComponent', () => {
  let component: HiringRoleMasterComponent;
  let fixture: ComponentFixture<HiringRoleMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HiringRoleMasterComponent]
    });
    fixture = TestBed.createComponent(HiringRoleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
