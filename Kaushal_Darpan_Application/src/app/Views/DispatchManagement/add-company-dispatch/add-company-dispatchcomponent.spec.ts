import { ComponentFixture, TestBed } from '@angular/core/testing';

import { addcompanydispatchComponent } from './add-company-dispatch.component';

describe('addBoardUniversityComponent', () => {
  let component: addcompanydispatchComponent;
  let fixture: ComponentFixture<addcompanydispatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [addcompanydispatchComponent]
    });
    fixture = TestBed.createComponent(addcompanydispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
