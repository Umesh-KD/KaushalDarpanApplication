import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollegeMasterComponent } from './add-college-master.component';

describe('AddCollegeMasterComponent', () => {
  let component: AddCollegeMasterComponent;
  let fixture: ComponentFixture<AddCollegeMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCollegeMasterComponent]
    });
    fixture = TestBed.createComponent(AddCollegeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
