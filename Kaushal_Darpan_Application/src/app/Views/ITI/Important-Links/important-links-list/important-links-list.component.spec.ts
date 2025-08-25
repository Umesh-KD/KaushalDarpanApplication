import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantLinksListComponent } from './important-links-list.component';

describe('ImportantLinksListComponent', () => {
  let component: ImportantLinksListComponent;
  let fixture: ComponentFixture<ImportantLinksListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportantLinksListComponent]
    });
    fixture = TestBed.createComponent(ImportantLinksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
