/* objectregistry.js */

// TODO: derive from AllocationGuard
export class ObjectRegistry {

    #objects = new Map();
    #resetList = new Array();


    constructor() {
        //super();
    }

    set(baseObject, registerForReset=false) {
        this.#objects.set(baseObject.constructor.name, baseObject)

        if (registerForReset) {
            this.registerForReset(baseObject);
        }
    }

    registerForReset(baseObject) {
        if (!this.#resetList.includes(baseObject)) {
            this.#resetList.push(baseObject);
        }
    }

    reset() {
        this.#resetList.forEach(baseObject => baseObject.reset());
    }

    /*
    dump() {
        this.#objects.forEach((value, key) => {
            console.log(key + ": " + value);
        });
    }
    */

}
