import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPublicInfoComponent } from './list-public-info.component';

describe('SeatIntakesListComponent', () => {
  let component: ListPublicInfoComponent;
  let fixture: ComponentFixture<ListPublicInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPublicInfoComponent]
    });
    fixture = TestBed.createComponent(ListPublicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
