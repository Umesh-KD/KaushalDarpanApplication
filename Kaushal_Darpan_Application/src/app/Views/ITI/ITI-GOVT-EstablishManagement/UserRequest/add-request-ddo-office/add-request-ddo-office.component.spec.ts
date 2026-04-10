import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestDDOOfficeComponent } from './add-request-ddo-office.component';

describe('AddRequestDDOOfficeComponent', () => {
  let component: AddRequestDDOOfficeComponent;
  let fixture: ComponentFixture<AddRequestDDOOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRequestDDOOfficeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRequestDDOOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
