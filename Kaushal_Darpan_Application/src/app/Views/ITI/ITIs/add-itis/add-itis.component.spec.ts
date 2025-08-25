import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddITIsComponent } from './add-itis.component';

describe('AddITIsComponent', () => {
  let component: AddITIsComponent;
  let fixture: ComponentFixture<AddITIsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddITIsComponent]
    });
    fixture = TestBed.createComponent(AddITIsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
