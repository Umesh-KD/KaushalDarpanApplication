import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIDownloadRollNoListComponent } from './iti-download-roll-no-list.component';

describe('ITIDownloadRollNoListComponent', () => {
  let component: ITIDownloadRollNoListComponent;
  let fixture: ComponentFixture<ITIDownloadRollNoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIDownloadRollNoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIDownloadRollNoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
