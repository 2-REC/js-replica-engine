/* objectmanager.js */

import { BaseObject } from "./baseobject.js";


export class ObjectManager extends BaseObject {

    #objects;
    #pendingAdditions;
    #pendingRemovals;


    constructor() {
        super();
        this.#objects = new Map();
        this.#pendingAdditions = new Map();
        this.#pendingRemovals = new Map();
    }

    reset() {
        this.commitUpdates();

        this.#objects.values().forEach(baseObject => {
            baseObject.reset();
        });

    }

    commitUpdates() {
        // adding pending additions
        this.#pendingAdditions.forEach((baseObject, uuid) => {
            this.#objects.set(uuid, baseObject);
        });
        this.#pendingAdditions.clear();

        // removing pending removals
        this.#pendingRemovals.keys().forEach(uuid => {
            this.#objects.delete(uuid);
        });
        this.#pendingRemovals.clear();
    }

    update(timeDelta, parent) {
        this.commitUpdates();

        this.#objects.values().forEach(baseObject => {
            baseObject.update(timeDelta, this);
        });
    }

    getObjects() {
        return this.#objects.values();
    }
    
    getCount() {
        return this.#objects.size;
    }
    

    getConcreteCount() {
        return this.#objects.size + this.#pendingAdditions.size - this.#pendingRemovals.size;
    }
    
    get(uuid) {
        return this.#objects.get(uuid);
    }

    add(baseObject) {
        this.#pendingAdditions.set(baseObject.uuid, baseObject);
    }

    remove(baseObject) {
        this.#pendingRemovals.set(baseObject.uuid, baseObject);
    }
    
    removeAll() {
        this.#objects.forEach((baseObject, uuid) => {
            this.#pendingRemovals.set(uuid, baseObject);
        });
        this.#pendingAdditions.clear();
    }

    findByClass(classType) {
        for (const baseObject of this.#objects.values()) {
            if (baseObject instanceof classType) {
                return baseObject;
            }
        }
        return null;
    }

    getPendingObjects() {
        return this.#pendingAdditions;
    }

}
