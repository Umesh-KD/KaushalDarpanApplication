import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTpoComponent } from './details-tpo.component';

describe('DetailsTpoComponent', () => {
  let component: DetailsTpoComponent;
  let fixture: ComponentFixture<DetailsTpoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsTpoComponent]
    });
    fixture = TestBed.createComponent(DetailsTpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
