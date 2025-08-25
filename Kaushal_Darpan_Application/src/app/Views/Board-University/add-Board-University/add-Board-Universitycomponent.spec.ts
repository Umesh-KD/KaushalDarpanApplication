import { ComponentFixture, TestBed } from '@angular/core/testing';

import { addBoardUniversityComponent } from './add-Board-University.component';

describe('addBoardUniversityComponent', () => {
  let component: addBoardUniversityComponent;
  let fixture: ComponentFixture<addBoardUniversityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [addBoardUniversityComponent]
    });
    fixture = TestBed.createComponent(addBoardUniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
