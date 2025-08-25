import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegesJanaadharComponent } from './colleges-janaadhar.component';

describe('CollegesJanaadharComponent', () => {
  let component: CollegesJanaadharComponent;
  let fixture: ComponentFixture<CollegesJanaadharComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollegesJanaadharComponent]
    });
    fixture = TestBed.createComponent(CollegesJanaadharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
