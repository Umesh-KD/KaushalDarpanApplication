import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITICompanydispatchlistComponent } from './iti-companydispatchlist.component';

describe('ITICompanydispatchlistComponent', () => {
  let component: ITICompanydispatchlistComponent;
  let fixture: ComponentFixture<ITICompanydispatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITICompanydispatchlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITICompanydispatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
