import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelMeritlistComponent } from './HostelMerit-list.component';

describe('StudentRequestListComponent', () => {
  let component: HostelMeritlistComponent;
  let fixture: ComponentFixture<HostelMeritlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostelMeritlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelMeritlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
