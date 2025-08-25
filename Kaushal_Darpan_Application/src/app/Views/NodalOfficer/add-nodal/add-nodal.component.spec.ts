import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNodalComponent } from './add-nodal.component';

describe('AddNodalComponent', () => {
  let component: AddNodalComponent;
  let fixture: ComponentFixture<AddNodalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNodalComponent]
    });
    fixture = TestBed.createComponent(AddNodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
