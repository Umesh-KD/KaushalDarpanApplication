import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPublicInfoComponent } from './add-public-info.component';

describe('AddSeatIntakesComponent', () => {
  let component: AddPublicInfoComponent;
  let fixture: ComponentFixture<AddPublicInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPublicInfoComponent]
    });
    fixture = TestBed.createComponent(AddPublicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
