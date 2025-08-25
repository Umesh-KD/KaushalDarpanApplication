import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestUserAddComponent } from './request-add.component';

describe('RequestUserAddComponent', () => {
  let component: RequestUserAddComponent;
  let fixture: ComponentFixture<RequestUserAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestUserAddComponent]
    });
    fixture = TestBed.createComponent(RequestUserAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
