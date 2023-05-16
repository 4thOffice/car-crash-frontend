import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, mergeMap, pipe, tap } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { CrashesApiService } from "../../shared/api/crashes/crashes-api.service";
import { createCrash, createCrashSuccessful, loadCrash, loadCrashSuccessful } from "./crash-action";
import { CrashModel } from "../../shared/models/crash.model";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadCars } from "../car/car-action";
import { CarsApiService } from "../../shared/api/cars/cars-api.service";

@Injectable()
export class CrashEffects {

  loadCrashes$ = createEffect(() => this.actions$.pipe(
      ofType(loadCrash),
      tap(() => this.store.dispatch(loadCars())),
      exhaustMap((action) => this.crashesApiService.getSingle(action.sessionId)
        .pipe(
          map(crash => ({ type: loadCrashSuccessful.type, crash })),
          catchError(() => EMPTY)
        ))
    )
  );

  createCrashSuccessful$ = createEffect(() => this.actions$.pipe(
      ofType(createCrashSuccessful),
      tap((action) => {
        this.router.navigate([`/crash/${action.crash.session_id}`])
      })
    )
  );

  constructor(
    private actions$: Actions,
    private crashesApiService: CrashesApiService,
    private carsApiService: CarsApiService,
    private router: Router,
    private store: Store
  ) {}
}
