import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedRollNoComponent } from './published-roll-no.component';

describe('PublishedRollNoComponent', () => {
  let component: PublishedRollNoComponent;
  let fixture: ComponentFixture<PublishedRollNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishedRollNoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishedRollNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
