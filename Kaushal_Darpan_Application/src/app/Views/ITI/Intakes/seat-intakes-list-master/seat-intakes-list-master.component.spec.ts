import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatIntakesListMasterComponent } from './seat-intakes-list-master.component';

describe('SeatIntakesListComponent', () => {
  let component: SeatIntakesListMasterComponent;
  let fixture: ComponentFixture<SeatIntakesListMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeatIntakesListMasterComponent]
    });
    fixture = TestBed.createComponent(SeatIntakesListMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
