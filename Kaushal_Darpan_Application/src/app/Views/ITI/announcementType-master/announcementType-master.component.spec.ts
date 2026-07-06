import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementTypeMasterComponent } from './announcementType-master.component';

describe('AnnouncementTypeMasterComponent', () => {
  let component: AnnouncementTypeMasterComponent;
  let fixture: ComponentFixture<AnnouncementTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnouncementTypeMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
