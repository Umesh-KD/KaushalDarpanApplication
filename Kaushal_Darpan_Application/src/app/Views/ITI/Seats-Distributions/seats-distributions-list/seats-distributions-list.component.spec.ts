import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatsDistributionsListComponent } from './seats-distributions-list.component';

describe('SeatsDistributionsListComponent', () => {
  let component: SeatsDistributionsListComponent;
  let fixture: ComponentFixture<SeatsDistributionsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeatsDistributionsListComponent]
    });
    fixture = TestBed.createComponent(SeatsDistributionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
