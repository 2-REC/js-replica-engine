/* uuids.js */

export class Uuids {

    // TODO: rename to max_object_per_frame (?)
    // TODO: allow to change?
//    static NB_OBJECTS_MAX = 512;

    static #current = 0;

    static reset() {
        this.#current = 0;
    }

    static getNext() {
        return this.#current++;
    }
}
