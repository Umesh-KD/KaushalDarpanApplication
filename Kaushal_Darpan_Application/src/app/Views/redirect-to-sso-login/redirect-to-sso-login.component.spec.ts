import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectToSsoLoginComponent } from './redirect-to-sso-login.component';

describe('RedirectToSsoLoginComponent', () => {
  let component: RedirectToSsoLoginComponent;
  let fixture: ComponentFixture<RedirectToSsoLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RedirectToSsoLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectToSsoLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
