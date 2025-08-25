import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGovtPostComponent } from './ITI-Govt-Post.component';

describe('ITIGovtPostComponent', () => {
  let component: ITIGovtPostComponent;
  let fixture: ComponentFixture<ITIGovtPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIGovtPostComponent]
    });
    fixture = TestBed.createComponent(ITIGovtPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
