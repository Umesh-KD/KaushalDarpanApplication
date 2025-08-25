import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTpoComponent } from './create-tpo.component';

describe('CreateTpoComponent', () => {
  let component: CreateTpoComponent;
  let fixture: ComponentFixture<CreateTpoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTpoComponent]
    });
    fixture = TestBed.createComponent(CreateTpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
