import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosteListComponent } from './roste-list.component';

describe('RosteComponent', () => {
  let component: RosteListComponent;
  let fixture: ComponentFixture<RosteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RosteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RosteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
