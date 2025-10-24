/* baseobject.js */

import { Uuids } from "./uuids.js";
import { ObjectRegistry } from "./objectregistry.js";


// TODO: later derive from AllocationGuard... (+call super/base in constructor)
export class BaseObject {

    static objectRegistry = new ObjectRegistry();

    #uuid;


    constructor() {
        if (new.target === BaseObject) {
            // TODO: error type?
            throw new Error(`Cannot instantiate ${BaseObject.name} directly.`);
        }

        //super();
        this.#uuid = Uuids.getNext();
    }

    get uuid() {
        return this.#uuid;
    }

    update(timeDelta, parent) {}

    reset() {
        throw new Error(`Abstract method '${this.reset.name}' must be implemented by subclasses.`);
    }

    addToRegistry(baseObject, registerForReset) {
        BaseObject.objectRegistry.set(baseObject, registerForReset);
    }

}
