import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTspAreasComponent } from './add-tsp-areas.component';

describe('AddTspAreasComponent', () => {
  let component: AddTspAreasComponent;
  let fixture: ComponentFixture<AddTspAreasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTspAreasComponent]
    });
    fixture = TestBed.createComponent(AddTspAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
