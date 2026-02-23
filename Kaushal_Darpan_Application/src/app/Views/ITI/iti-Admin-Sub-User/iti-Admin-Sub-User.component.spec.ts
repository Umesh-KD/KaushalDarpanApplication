import { ComponentFixture, TestBed } from '@angular/core/testing';

import { itiAdminSubUserComponent } from './iti-Admin-Sub-User.component';  ///

describe('itiAdminSubUserComponent', () => {
  let component: itiAdminSubUserComponent;
  let fixture: ComponentFixture<itiAdminSubUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [itiAdminSubUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(itiAdminSubUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
