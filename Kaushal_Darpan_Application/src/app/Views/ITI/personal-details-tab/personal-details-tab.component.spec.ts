import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailsTabComponent } from './personal-details-tab.component';

describe('PersonalDetailsTabComponent', () => {
  let component: PersonalDetailsTabComponent;
  let fixture: ComponentFixture<PersonalDetailsTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalDetailsTabComponent]
    });
    fixture = TestBed.createComponent(PersonalDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
