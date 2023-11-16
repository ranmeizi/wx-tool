import { TrackingTrait } from './abstract';
import { Duration } from './duration';

type TrackAdaptor = () => TrackingTrait;

export class Agent<T = any> {
  controllers: TrackingTrait<T>[] = [];

  use(impl: TrackAdaptor) {
    this.controllers.push(impl());
  }

  initialize: TrackingTrait<T>['initialize'] = applyFn('initialize').bind(this);
  track: TrackingTrait<T>['track'] = applyFn('track').bind(this);
  setGlobal: TrackingTrait<T>['setGlobal'] = applyFn('setGlobal').bind(this);
  setAccount: TrackingTrait<T>['setAccount'] = applyFn('setAccount').bind(this);

  duration = new Duration({
    track: this.track,
  });
}

function applyFn(name: keyof TrackingTrait) {
  return function (this: Agent) {
    this.controllers.forEach((controller) => {
      if (typeof controller[name] === 'function') {
        controller[name].apply(controller, arguments as any);
      }
    });
  };
}
