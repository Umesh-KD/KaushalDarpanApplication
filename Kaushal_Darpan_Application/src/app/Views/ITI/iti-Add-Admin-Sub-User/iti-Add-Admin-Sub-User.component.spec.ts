import { ComponentFixture, TestBed } from '@angular/core/testing';

import { itiAddAdminSubUserComponent } from './iti-Add-Admin-Sub-User.component';  

describe('itiAddAdminSubUserComponent', () => {
  let component: itiAddAdminSubUserComponent;
  let fixture: ComponentFixture<itiAddAdminSubUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [itiAddAdminSubUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(itiAddAdminSubUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
