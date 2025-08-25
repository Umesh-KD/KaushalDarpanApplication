import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVerifierComponent } from './add-verifier.component';

describe('AddVerifierComponent', () => {
  let component: AddVerifierComponent;
  let fixture: ComponentFixture<AddVerifierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddVerifierComponent]
    });
    fixture = TestBed.createComponent(AddVerifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
