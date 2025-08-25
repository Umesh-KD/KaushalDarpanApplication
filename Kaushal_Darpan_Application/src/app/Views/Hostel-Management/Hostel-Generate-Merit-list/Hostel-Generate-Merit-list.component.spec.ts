import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelGenerateMeritlistComponent } from './Hostel-Generate-Merit-list.component';

describe('StudentRequestListComponent', () => {
  let component: HostelGenerateMeritlistComponent;
  let fixture: ComponentFixture<HostelGenerateMeritlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostelGenerateMeritlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelGenerateMeritlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
