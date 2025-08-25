import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDetailsFormComponent } from './other-details-form.component';

describe('OtherDetailsFormComponent', () => {
  let component: OtherDetailsFormComponent;
  let fixture: ComponentFixture<OtherDetailsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherDetailsFormComponent]
    });
    fixture = TestBed.createComponent(OtherDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
