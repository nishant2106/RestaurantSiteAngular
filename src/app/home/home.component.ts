import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]':'true',
    'style': 'display:block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {
  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  leaderErrMess: string;
  promotionErrMess: string;

  constructor(
    private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderservice: LeaderService,
    @Inject('baseURL') public baseURL
  ) {}

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe((dishes) => (this.dish = dishes),
      dishErrMess => this.dishErrMess= dishErrMess);
    this.promotionservice
      .getFeaturedPromotion()
      .subscribe((promotion) => (this.promotion = promotion),
      promotionErrMess => this.promotionErrMess = promotionErrMess);
    this.leaderservice.getFeaturedLeader()
    .subscribe((leader => this.leader = leader),
      leaderErrMess => this.leaderErrMess = leaderErrMess);
  }
}
