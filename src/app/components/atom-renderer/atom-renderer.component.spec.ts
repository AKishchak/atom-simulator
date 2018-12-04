import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomRendererComponent } from './atom-renderer.component';

describe('AtomRendererComponent', () => {
  let component: AtomRendererComponent;
  let fixture: ComponentFixture<AtomRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtomRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
