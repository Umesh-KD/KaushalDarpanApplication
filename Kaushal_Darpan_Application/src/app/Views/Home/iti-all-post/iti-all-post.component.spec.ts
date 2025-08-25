import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIAllPostComponent } from './iti-all-post.component';

describe('AllPostComponent', () => {
  let component: ITIAllPostComponent;
  let fixture: ComponentFixture<ITIAllPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIAllPostComponent]
    });
    fixture = TestBed.createComponent(ITIAllPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
