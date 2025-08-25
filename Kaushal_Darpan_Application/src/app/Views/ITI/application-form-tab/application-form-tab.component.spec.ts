import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFormTabComponent } from './application-form-tab.component';

describe('ApplicationFormTabComponent', () => {
  let component: ApplicationFormTabComponent;
  let fixture: ComponentFixture<ApplicationFormTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationFormTabComponent]
    });
    fixture = TestBed.createComponent(ApplicationFormTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
