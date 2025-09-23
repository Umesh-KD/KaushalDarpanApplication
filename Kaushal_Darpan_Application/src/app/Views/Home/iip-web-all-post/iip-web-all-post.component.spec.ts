import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IIPWebAllPostComponent } from './iip-web-all-post.component';

describe('IIPWebAllPostComponent', () => {
  let component: IIPWebAllPostComponent;
  let fixture: ComponentFixture<IIPWebAllPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IIPWebAllPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IIPWebAllPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
