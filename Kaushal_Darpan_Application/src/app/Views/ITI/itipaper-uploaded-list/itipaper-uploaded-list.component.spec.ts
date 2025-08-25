import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIPaperUploadedListComponent } from './itipaper-uploaded-list.component';

describe('ITIPaperUploadedListComponent', () => {
  let component: ITIPaperUploadedListComponent;
  let fixture: ComponentFixture<ITIPaperUploadedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIPaperUploadedListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIPaperUploadedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
