import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperSetProfessorComponent } from './paper-set-professor.component';

describe('PaperSetProfessorComponent', () => {
  let component: PaperSetProfessorComponent;
  let fixture: ComponentFixture<PaperSetProfessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaperSetProfessorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperSetProfessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
