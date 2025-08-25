import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHrMasterComponent } from './add-hr-master.component';

describe('AddHrMasterComponent', () => {
  let component: AddHrMasterComponent;
  let fixture: ComponentFixture<AddHrMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHrMasterComponent]
    });
    fixture = TestBed.createComponent(AddHrMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
