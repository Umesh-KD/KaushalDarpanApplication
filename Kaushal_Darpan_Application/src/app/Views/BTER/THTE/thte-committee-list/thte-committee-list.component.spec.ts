import { ComponentFixture, TestBed } from '@angular/core/testing';

import { THTECommitteeListComponent } from './thte-committee-list.component';

describe('THTECommitteeListComponent', () => {
  let component: THTECommitteeListComponent;
  let fixture: ComponentFixture<THTECommitteeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [THTECommitteeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(THTECommitteeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
