import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtereEMRequestAddComponent } from './bter-em-request-addComponent';

describe('BtereEMRequestAddComponent', () => {
  let component: BtereEMRequestAddComponent;
  let fixture: ComponentFixture<BtereEMRequestAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BtereEMRequestAddComponent]
    });
    fixture = TestBed.createComponent(BtereEMRequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
