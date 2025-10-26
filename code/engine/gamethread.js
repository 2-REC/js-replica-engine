/* gamethread.js */


class GameThread {

    // TODO: what size? from where?
    //#BUFFER_SIZE = 2048;
    #BUFFER_SIZE = 102400;
    // TODO: could have more than 3 if needed... (if main/render is too slow)
    //#NB_BUFFERS = 3;
    #NB_BUFFERS = 4;

    #workerScope;
    //#drawables
    #context;
    #availableBuffers;
    #lastTime;
    #frameDuration;
    // TODO: get from context?
    #fps = 60;
    #accumulatedTime;


    constructor(workerScope) {
        this.#workerScope = workerScope;

        // initialize buffers
        this.#availableBuffers = new Array(this.#NB_BUFFERS);
        for (let i=0; i<this.#NB_BUFFERS; ++i) {
            const arrayBuffer = new ArrayBuffer(this.#BUFFER_SIZE);
            this.#availableBuffers[i] = new Float64Array(arrayBuffer);
        }

        // set message handler
        this.#workerScope.onmessage = (event) => {
            const { type, payload } = event.data;
            this.messageHandler(type, payload);
        }

    }

    /* Handled events (ordered by priority):
        - game_event
        - input
        - buffer
        - init
        - load_level
        - start_level
    */
    messageHandler(type, payload) {
        // TODO: try/catch?
        switch(type) {
            case "game_event":
                // TODO: handle event
                break;
            case "input":
                // TODO: handle event
                break;
            case "buffer":
                this.#availableBuffers.push(payload.buffer);
                break;
            case "load_level":
                this.onLoadMessage(payload);
                break;
            case "start_level":
                // no payload
                this.#lastTime = performance.now();
                this.loop();
//                setTimeout(this.loop);
                break;
            default:
                // TODO: exception?
                console.log(`Unexpected event type '${type}'! => Ignoring`);
                break;
        }

    }

    onInitMessage(payload) {
        const context = payload.context;
        const drawables = payload.buffer;

        // TODO: receive the context + drawables data (2 messages or combined?)
        // => split+views data here
        this.initData(context, drawables);
        //...

        // TODO: need to send something else?
        this.#workerScope.postMessage("init_done");
    }


    onLoadMessage(level) {
        // build level
        const resultbuffer = this.buildLevel(level);

// TODO: for copy or transfer? (still needed here?)
        // TODO: send instead the renderable data (list of IDs to load)
        // send render data to main thread
        this.#workerScope.postMessage({
            type: "level_loaded",
            payload: {
                buffer: resultbuffer
            }
        }, [resultbuffer.buffer]);

    }

    loop() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.#lastTime;
        this.#lastTime = currentTime;

        this.#accumulatedTime += deltaTime;
        while (this.#accumulatedTime >= this.#frameDuration) {
            this.#accumulatedTime -= this.#frameDuration;
            const handled = this.update(this.#frameDuration);
            if (!handled)
                break;
        }

        setTimeout(() => this.loop());
    }

    initData(context, floatbuffer) {
        // process init data
/*
console.log(`CONTEXT: ${context}`);
console.log(`floatbuffer: ${floatbuffer}`);
*/

        this.#frameDuration = 1000 / this.#fps;
        this.#accumulatedTime = 0;
    }

    update(frameDuration) {
//console.log("UPDATE: " + frameDuration);

        // TODO: handle frameDuration

        if (this.#availableBuffers.length === 0) {
            return false;
        }

        // buffer as Float64Array
        const buffer = this.#availableBuffers.shift();

        // process... (logic udpdates, etc.)
///////////////////////////////
// fake processing
const min = 10000;
const max = 100000;
const cpt = Math.floor(Math.random() * (max - min + 1)) + min
for (let i=0; i<cpt; ++i) {
//    console.log("WORKING");
}
///////////////////////////////
        buffer[0] = 0;
        // call process method!?
        //... gameRoot.update (set via 'setGameRoot')

        // notify main thread to render frame (TODO: rephrase)
        this.#workerScope.postMessage({
            type: "draw",
            payload: {
                buffer: buffer
            }
        }, [buffer.buffer]);

        return true;
    }

    buildLevel(level) {
//console.log(`build level: ${level}`);

        const buffer = this.#availableBuffers.shift();

// TODO: send draw buffer (transfer) or different buffer with only IDs (copy)?
        buffer[0] = 0;

        // TODO: build level => buffer
        // use a set size per entry, and map each entry in buffer (first value is the number of entries)
        buffer[1] = 12.5;
        ++buffer[0];

        return buffer;
    }

}


// expect to get created from main thread and to receive a "init" message
let gameThread;

self.onmessage = (event) => {
    const { type, payload } = event.data;
    if (type === "init") {
        gameThread = new GameThread(self);
        gameThread.onInitMessage(payload);
    } else {
        // exception?
        console.log(`Unexpected event type '${type}'! => Ignoring`);
    }
};
