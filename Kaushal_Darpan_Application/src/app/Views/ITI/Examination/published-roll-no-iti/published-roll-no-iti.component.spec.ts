import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedRollNoITIComponent } from './published-roll-no-iti.component';

describe('PublishedRollNoITIComponent', () => {
  let component: PublishedRollNoITIComponent;
  let fixture: ComponentFixture<PublishedRollNoITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishedRollNoITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishedRollNoITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
