import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperSetterAssignListComponent } from './paper-setter-assign-list.component';

describe('PaperSetterAssignListComponent', () => {
  let component: PaperSetterAssignListComponent;
  let fixture: ComponentFixture<PaperSetterAssignListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaperSetterAssignListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperSetterAssignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
