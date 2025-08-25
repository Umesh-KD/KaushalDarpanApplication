import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardUniversityComponent } from './Board-University.component';

describe('BoardUniversityComponent', () => {
  let component: BoardUniversityComponent;
  let fixture: ComponentFixture<BoardUniversityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardUniversityComponent]
    });
    fixture = TestBed.createComponent(BoardUniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
