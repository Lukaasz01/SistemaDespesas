import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { EditarCategoria } from './editar-categoria';

describe('EditarCategoria', () => {
  let component: EditarCategoria;
  let fixture: ComponentFixture<EditarCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCategoria],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarCategoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
