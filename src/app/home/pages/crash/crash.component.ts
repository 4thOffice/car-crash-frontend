import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CarModel } from "../../../shared/models/car.model";
import { map, mergeMap, Observable, of, take, tap } from "rxjs";
import { CrashModel } from "../../../shared/models/crash.model";
import { Store } from "@ngrx/store";
import { createCrashSuccessful, loadCrash } from "../../../app-state/crash/crash-action";
import { selectCrash } from "../../../app-state/crash/crash-selector";
import { selectCars } from "../../../app-state/car/car-selector";
import { createCar, createCarSuccessful, deleteCar, updateCar } from "../../../app-state/car/car-action";
import { ModalService } from "../../../shared/services/modal.service";
import { BaseFormModalComponent } from "../../../shared/components/modals/base-form-modal/base-form-modal.component";
import { CarFormComponent } from "../../../shared/components/forms/car-form/car-form.component";
import { CarFormModule } from "../../../shared/components/forms/car-form/car-form.module";
import { CrashFormComponent } from "../../../shared/components/forms/crash-form/crash-form.component";
import { CrashFormModule } from "../../../shared/components/forms/crash-form/crash-form.module";
import { TranslocoService } from "@ngneat/transloco";
import { CrashesApiService } from "../../../shared/api/crashes/crashes-api.service";
import { CarsApiService } from "../../../shared/api/cars/cars-api.service";

@Component({
  selector: 'app-crash',
  templateUrl: './crash.component.html',
  styleUrls: ['./crash.component.scss']
})
export class CrashComponent implements OnInit {
  crash$: Observable<CrashModel> = this.store.select(selectCrash);
  cars$: Observable<CarModel[]> = this.store.select(selectCars);

  carExists$: Observable<boolean> = this.cars$
    .pipe(
      map((cars: CarModel[]) => {
        return cars && cars.length > 0
      })
    )

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly modalService: ModalService,
    private readonly translateService: TranslocoService,
    private readonly crashesApiService: CrashesApiService,
    private readonly carsApiService: CarsApiService
  ) {}

  ngOnInit(): void {
    this.getData();
  }


  createCar() {
    this.modalService.open(BaseFormModalComponent, {
      formComponent: {
        component: CarFormComponent,
        module: CarFormModule,
      },
      model: new CarModel(),
      title: 'Create car',
      afterSubmit$: (car: CarModel) =>
        this.crash$
          .pipe(
            take(1),
            mergeMap((crash: CrashModel | undefined) => {
              if (!crash) {
                throw new Error("CrashModel undefined");
              }
              car.crash = crash.id
              return this.carsApiService.create(car)
                .pipe(
                  tap((_car: CarModel) => {
                    this.store.dispatch(createCarSuccessful({ car: _car }));
                    this.router.navigate([`cars/${_car.id}`], { relativeTo: this.route })
                  })
                );
            }),
          )
    });
  }

  editCar(car: CarModel) {
    this.modalService.open(BaseFormModalComponent, {
      formComponent: {
        component: CarFormComponent,
        module: CarFormModule,
      },
      model: car,
      title: 'Edit car',
      afterSubmit$: (car: CarModel) =>
        this.crash$
          .pipe(
            take(1),
            tap((crash: CrashModel | undefined) => {
              if (!crash) {
                throw new Error("CrashModel undefined");
              }
              car.crash = crash.id
              this.store.dispatch(updateCar({car: car}))
            }),
          )
    });
  }

  deleteCar(carId: number) {
    this.crash$
      .pipe(
        take(1),
        tap((crash: CrashModel | undefined) => {
          if (!crash) {
            throw new Error("CrashModel undefined");
          }
          this.store.dispatch(deleteCar({carId: carId}))
        }),
      ).subscribe()
  }

  getData(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('sessionId')),
        tap((sessionId: string | null) => {
          if (sessionId) {
            this.store.dispatch(loadCrash({sessionId: sessionId}));
          }
        }),
      )
      .subscribe()
  }

  editCrash(): void {
    this.crash$
      .pipe(
        take(1),
        tap((crash: CrashModel | undefined) => {
          this.modalService.open(BaseFormModalComponent, {
            formComponent: {
              component: CrashFormComponent,
              module: CrashFormModule,
            },
            model: crash ?? new CrashModel(),
            title: this.translateService.translate('car-crash.crash.crash.edit-title'),
            afterSubmit$: (crash: CrashModel) => {
              return this.crashesApiService.put(crash)
                .pipe(
                  tap((crash: CrashModel) => {
                    this.store.dispatch(createCrashSuccessful({crash: crash}))
                  })
                )
            }
          });
        })
      ).subscribe()
  };
}
