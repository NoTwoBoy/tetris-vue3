import { Ref } from "@vue/reactivity";

import * as gameConfig from "../config";
import { Map } from "./map";
import { Shape } from "./shape";
import { Ticker } from "./ticker";

import {
  hitBottomBoundary,
  hitBottomBox,
  hitHorizontalBoundary,
  hitHorizontalBox,
} from "./hit";

export class Game {
  private _map: Map;
  private _activeShape: any = null;
  private _ticker: Ticker;
  private _timer: any;
  private _speed: number = gameConfig.timeInterval;
  private _score: Ref<number>;

  constructor(mapArray: any[], score: Ref<number>) {
    this._score = score;
    this._map = new Map(mapArray, gameConfig.mapRow, gameConfig.mapCol);
    this._ticker = new Ticker();

    this._map.initMap();
  }

  get activeShape(): Shape {
    return this._activeShape;
  }

  get map(): Map {
    return this._map;
  }

  startGame() {
    this.createShape();
    this._ticker.addTicker(this.handleTicker.bind(this));
  }

  createShape() {
    this._activeShape = new Shape();
    return this.startMoveDown();
  }

  handleTicker() {
    this._map.render(this._activeShape);
  }

  startMoveDown() {
    this._timer = setInterval(() => {
      this.moveDown();
    }, this._speed);
    return this._timer;
  }

  async moveDown() {
    if (hitBottomBoundary.call(this) || hitBottomBox.call(this)) {
      await this._map.saveHitBottomShape(this._activeShape);
      this._map.eliminateLine(this._score);
      this.createShape();

      clearInterval(this._timer);
      this._timer = null;
      return;
    }
    this._activeShape.y++;
  }

  horizontalMove(type: string) {
    if (
      hitHorizontalBoundary.call(this, type) ||
      hitHorizontalBox.call(this, type)
    )
      return;
    this._activeShape.x += type === "left" ? -1 : 1;
  }

  rotateShape() {
    this._activeShape.rotateShape(this._map);
  }
}
