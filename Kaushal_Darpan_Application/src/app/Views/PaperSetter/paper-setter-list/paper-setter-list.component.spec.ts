import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperSetterListComponent } from './paper-setter-list.component';

describe('PaperSetterListComponent', () => {
  let component: PaperSetterListComponent;
  let fixture: ComponentFixture<PaperSetterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaperSetterListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperSetterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
