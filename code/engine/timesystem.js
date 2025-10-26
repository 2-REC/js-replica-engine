/* timesystem */

import { BaseObject } from "./baseobject.js";
import { Lerp } from "./utils.js";


export class TimeSystem extends BaseObject {

    // TODO: should be a constant...
    #EASE_DURATION = 0.5;

    #gameTime;
    #realTime;
    #freezeDelay;
    #gameFrameDelta;
    #realFrameDelta;

    #targetScale;
    #scaleDuration;
    #scaleStartTime;
    #easeScale;


    constructor() {
        super();
        this.reset();
    }

    reset() {
        this.#gameTime = 0.0;
        this.#realTime = 0.0;
        this.#freezeDelay = 0.0;
        this.#gameFrameDelta = 0.0;
        this.#realFrameDelta = 0.0;

        this.#targetScale = 1.0;
        this.#scaleDuration = 0.0;
        this.#scaleStartTime = 0.0;
        this.#easeScale = false;
    }

    update(timeDelta, parent) {
    	this.#realTime += timeDelta;
    	this.#realFrameDelta = timeDelta;

        if (this.#freezeDelay > 0.0) {
            this.#freezeDelay -= timeDelta;
            this.#gameFrameDelta = 0.0;
        } else {
        	let scale = 1.0;
        	if (this.#scaleStartTime > 0.0) {
        		const scaleTime = this.#realTime - this.#scaleStartTime;
        		if (scaleTime > this.#scaleDuration) {
        			this.#scaleStartTime = 0.0;
        		} else {
        			if (this.#easeScale) {
        				if (scaleTime <= this.#EASE_DURATION) {
        					// ease in
        					scale = Lerp.ease(1.0, this.#targetScale, this.#EASE_DURATION, scaleTime);
        				} else if (this.#scaleDuration - scaleTime < this.#EASE_DURATION) {
        					// ease out
        					const easeOutTime = this.#EASE_DURATION - (this.#scaleDuration - scaleTime);
        					scale = Lerp.ease(this.#targetScale, 1.0, this.#EASE_DURATION, easeOutTime);
        				} else {
        					scale = this.#targetScale;
        				}
        			} else {
        				scale = this.#targetScale;
        			}
        		}
            }

            this.#gameTime += (timeDelta * scale);
            this.#gameFrameDelta = (timeDelta * scale);
        }
    }

    getGameTime() {
        return this.#gameTime;
    }

    getRealTime() {
        return this.#realTime;
    }

    getFrameDelta() {
        return this.#gameFrameDelta;
    }

    getRealTimeFrameDelta() {
        return this.#realFrameDelta;
    }

    freeze(seconds) {
        this.#freezeDelay = seconds;
    }

    applyScale(scaleFactor, duration, ease) {
    	this.#targetScale = scaleFactor;
    	this.#scaleDuration = duration;
    	this.#easeScale = ease;
    	if (this.#scaleStartTime <= 0.0) {
    		this.#scaleStartTime = this.#realTime;
    	}
    }

    // TOOD: check if ok
    extendScale(duration) {
        this.#scaleDuration = duration;
        this.#scaleStartTime = this.#realTime;
    }

}
