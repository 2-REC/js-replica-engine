/* mainloop.js */

import { ObjectManager } from "./objectmanager.js";
import { TimeSystem } from "./timesystem.js";


export class MainLoop extends ObjectManager {

    #timeSystem;

    constructor() {
        super();

        this.#timeSystem = new TimeSystem();
        this.addToRegistry(this.#timeSystem, true);
    }

    update(timeDelta, parent) {
        this.#timeSystem.update(timeDelta, parent);

        const newTimeDelta = this.#timeSystem.getFrameDelta();
        super.update(newTimeDelta, parent);
    }

}
