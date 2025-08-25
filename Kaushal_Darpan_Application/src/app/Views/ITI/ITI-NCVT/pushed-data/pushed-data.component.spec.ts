import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushedDataComponent } from './pushed-data.component';

describe('PushedDataComponent', () => {
  let component: PushedDataComponent;
  let fixture: ComponentFixture<PushedDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PushedDataComponent]
    });
    fixture = TestBed.createComponent(PushedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
