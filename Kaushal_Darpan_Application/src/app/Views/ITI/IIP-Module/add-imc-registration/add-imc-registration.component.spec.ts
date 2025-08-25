import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItiIMCRegistrationComponent } from './add-imc-registration.component';

describe('AddItiIMCRegistrationComponent', () => {
  let component: AddItiIMCRegistrationComponent;
  let fixture: ComponentFixture<AddItiIMCRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItiIMCRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItiIMCRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
