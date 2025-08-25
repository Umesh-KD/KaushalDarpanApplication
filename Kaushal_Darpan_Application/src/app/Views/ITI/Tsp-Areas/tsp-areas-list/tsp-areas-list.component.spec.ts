import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TspAreasListComponent } from './tsp-areas-list.component';

describe('TspAreasListComponent', () => {
  let component: TspAreasListComponent;
  let fixture: ComponentFixture<TspAreasListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TspAreasListComponent]
    });
    fixture = TestBed.createComponent(TspAreasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
