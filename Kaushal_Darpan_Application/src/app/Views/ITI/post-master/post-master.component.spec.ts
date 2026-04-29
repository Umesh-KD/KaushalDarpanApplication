import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMasterComponent } from './post-master.component';

describe('PostMasterComponent', () => {
  let component: PostMasterComponent;
  let fixture: ComponentFixture<PostMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
