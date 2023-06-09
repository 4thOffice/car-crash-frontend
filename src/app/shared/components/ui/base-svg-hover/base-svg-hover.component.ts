import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Renderer2,
  ViewChild
} from '@angular/core';
import { CarModel } from "../../../models/car.model";
import { combineLatest, ReplaySubject, Subscription, tap } from "rxjs";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { CookieService } from "ngx-cookie-service";

@Component({
  template: '',
})
export abstract class BaseSvgHoverComponent implements AfterViewInit, OnDestroy, OnChanges, OnInit {
  protected readonly renderer2: Renderer2 = inject(Renderer2);
  protected readonly cookieService: CookieService = inject(CookieService);

  @Input() car!: CarModel;
  protected selectedClass = 'selected';

  @ViewChild('svgImage') svgImage?: ElementRef<SVGElement>;

  private readonly viewInit$: ReplaySubject<void> = new ReplaySubject<void>(1);
  private readonly change$: ReplaySubject<void> = new ReplaySubject<void>(1);

  private viewInitSub?: Subscription;

  protected listeners: (()=>void)[] = [];
  protected selectedParts: string[] = [];

  disabled = false;

  abstract onViewReady(): void;
  abstract afterSvgItemClicked(): void;
  abstract addListeners(): void;

  ngAfterViewInit(): void {
    this.viewInit$.next();
  }

  ngOnChanges(): void {
    this.change$.next();
  }

  ngOnDestroy(): void {
    this.viewInitSub?.unsubscribe();
    this.listeners.forEach(listener => listener());
  }

  ngOnInit(): void {
    this.viewInitSub = combineLatest([this.viewInit$, this.change$])
      .pipe(
        tap(() => {
          this.onViewReady();
          if (this.listeners.length === 0) {
            if (this.car.creator === this.cookieService.get(CookieName.sessionId)) {
              this.addListeners();
            } else {
              this.disabled = true;
            }
          }
        })
      ).subscribe();
  }

  protected onPathClick(event: PointerEvent) {
    const clickedElement = event.currentTarget as HTMLElement;

    if (clickedElement.classList.contains(this.selectedClass)) {
      clickedElement.classList.remove(this.selectedClass);
      this.selectedParts.splice(this.selectedParts.indexOf(clickedElement.id), 1);
    } else {
      clickedElement.classList.add(this.selectedClass);
      this.selectedParts = [...this.selectedParts, clickedElement.id];
    }
    this.afterSvgItemClicked();
  }

}
