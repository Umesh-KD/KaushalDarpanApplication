import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGOVTEMPersonalDetailsApplicationFormTabComponent } from './ITI-GOVT-EM-PersonalDetailsApplication-Form-Tab.component';

describe('ApplicationFormTabComponent', () => {
  let component: ITIGOVTEMPersonalDetailsApplicationFormTabComponent;
  let fixture: ComponentFixture<ITIGOVTEMPersonalDetailsApplicationFormTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIGOVTEMPersonalDetailsApplicationFormTabComponent]
    });
    fixture = TestBed.createComponent(ITIGOVTEMPersonalDetailsApplicationFormTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
