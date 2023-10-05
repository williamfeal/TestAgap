import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Subscription } from 'rxjs';

import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styleUrls: ['./hero-page.component.css']
})
export class HeroPageComponent implements OnInit, OnDestroy {

  public hero?: Hero;
  private subscription: Subscription = new Subscription(); // Track all subscriptions

  /**
   * Constructor for the HeroPageComponent.
   *
   * @param heroesService - Service to interact with heroes data.
   * @param activatedRoute - Service to access route parameters.
   * @param router - Service to navigate among routes.
   */
  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  /**
   * Initializes the component. Fetches the hero based on the provided route parameter.
   */
  public ngOnInit(): void {
    // Track the subscription to automatically clean it up later.
    this.subscription.add(
      this.activatedRoute.params
        .pipe(
          switchMap( ({ id }) => this.heroesService.getHeroById( id )),
        )
        .subscribe( hero => {
          if ( !hero ) {
            this.router.navigate([ '/heroes/list' ]);
            return; // Regresa de la función si no hay héroe
          }
          this.hero = hero;
        })
    );
  }

  /**
   * Navigate back to the list of heroes.
   */
  public goBack(): void {
    this.router.navigateByUrl('heroes/list');
  }

  /**
   * Cleanup method. Unsubscribes from any active observables.
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
