import { ComponentFixture, TestBed } from '@angular/core/testing';

import { THTECommitteeComponent } from './thte-committee.component';

describe('THTECommitteeComponent', () => {
  let component: THTECommitteeComponent;
  let fixture: ComponentFixture<THTECommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [THTECommitteeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(THTECommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
