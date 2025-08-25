import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedEnrollNoComponent } from './published-enroll-no.component';

describe('PublishedEnrollNoComponent', () => {
  let component: PublishedEnrollNoComponent;
  let fixture: ComponentFixture<PublishedEnrollNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublishedEnrollNoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishedEnrollNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
