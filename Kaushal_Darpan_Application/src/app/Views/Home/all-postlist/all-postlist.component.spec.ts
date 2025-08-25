import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPostlistComponent } from './all-postlist.component';

describe('AllPostlistComponent', () => {
  let component: AllPostlistComponent;
  let fixture: ComponentFixture<AllPostlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllPostlistComponent]
    });
    fixture = TestBed.createComponent(AllPostlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
