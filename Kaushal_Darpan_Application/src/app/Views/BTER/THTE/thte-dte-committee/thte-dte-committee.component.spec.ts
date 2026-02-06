import { ComponentFixture, TestBed } from '@angular/core/testing';

import { THTEDTECommitteeComponent } from './thte-dte-committee.component';

describe('THTEDTECommitteeComponent', () => {
  let component: THTEDTECommitteeComponent;
  let fixture: ComponentFixture<THTEDTECommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [THTEDTECommitteeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(THTEDTECommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
