/*
import { BaseObject } from "./baseobject.js";
import { MainLoop } from "./mainloop.js";
*/


// TODO: extend from AllocationGuard
export class Game {

    #worker;

    #running = false;
    #setupDone = false;
//mGLDataLoaded = false;
//mContextParameters = new ContextParameters();
    #paused = false;

    #loopId;
    #nextBuffer = null;


/*
    constructor() {
        //super();

    }
*/

    // TODO: keep 'bootstrap' name?
    init() {
        if (this.#setupDone)
            return;



        // create game web worker
        // TODO: check if works - should have fallback when not suuported
        this.#worker = new Worker(new URL("gamethread.js", import.meta.url), { type: 'module' });
        //this.#worker = new Worker(new URL("gamethread.js", import.meta.url));


const BUFFER_SIZE = 2048;
// TODO: should be class member
const buffer = new ArrayBuffer(BUFFER_SIZE);

// TODO: send drawables + context (=> copies) (together or separate messages?)
// TODO: type?
/*
drawableBuffer = {
    ???? (dict? list? ...?)
}
*/
const drawableBuffer = new Float64Array(buffer);

        this.#worker.onmessage = (event) => {
            if (event.data === "init_done") {
                this.#setupDone = true;
// TODO: call something to inform init done...!?
            } else {
                // exception?
                console.log(`Unexpected event type '${event.data}'! => Ignoring`);
            }
        };

// TODO: get from somewhere...
const context = {
    "fps": 60,
    width: 640,
    height: 480
}

        // send for copy
        this.#worker.postMessage({
            type: "init",
            payload: {
                context: context,
                buffer: drawableBuffer
            }
        });

/*
        // TODO: NOT HERE!!!!!
        document.addEventListener('keydown', (e) => {
            worker.postMessage({ type: 'input', key: e.key });
        });
*/

        //...
        /*
        GameRenderer

        OpenGLSystem
        CustomToastSystem
        ContextParameters
        EventRecorder
        TextureLibrary shortTermTextureLibrary
        TextureLibrary longTermTextureLibrary
        BufferLibrary
        SoundSystem
        */

        //let gameRoot = MainLoop();


        // TODO: HOW TO HANDLE INPUTS!?!?!?!
        //let inputSystem = InputSystem(); // TODO: abstract class? need variants?
        //BaseObject.objectRegistry.set(inputSystem, true);

        /*
        HudSystem
        InputGameInterface

        LevelSystem
        CollisionSystem
        collision.loadCollisionTiles(...)
        HitPointPool

        GameObjectManager
        GameObjectFactory
        HotSpotSystem
        LevelBuilder
        ChannelSystem
        CameraSystem

        GameObjectCollisionSystem
        RenderSystem
        VectorPool
        DrawableFactory

        objectFactory.preloadEffects();

        // TODO: gameThread, which will call 'update'
        mGameThread = new GameThread(mRenderer);
        mGameThread.setGameRoot(mGameRoot);

        mCurrentLevel = null;
        */

//        this.#setupDone = true;
    }

    loadLevel(level) {
        // prepare for feedback message
        this.#worker.onmessage = (event) => {
            const { type, payload } = event.data;
            if (type === "level_loaded") {
                // TODO: load textures (use 'createImageBitmap', see snippet in notepad++)
                console.log("load textures...");
                // 'payload' is a view buffer
            } else {
                // exception?
                console.log(`Unexpected event type '${type}'! => Ignoring`);
            }
        }

        // send message to load level
        this.#worker.postMessage({ type: "load_level", payload: level });
    }



//    #ccpt = 0;

    start() {
        // prepare for feedback message
        this.#worker.onmessage = (event) => {

/*
this.#ccpt++;
console.log(`MAIN CPT: ${this.#ccpt}`);
if (this.#ccpt > 100) {
console.log("MAIN LEAVE");
    return;
}
console.log("MAIN CONTINUE");
*/

            const { type, payload } = event.data;
            if (type === "draw") {
                this.onDrawMessage(payload.buffer);
            } else {
// TODO: handle errors and other messages (status/error/etc)
                // exception?
                console.log(`Unexpected event type '${type}'! => Ignoring`);
            }

        };

        // send message to start level
        this.#worker.postMessage({ type: "start_level", payload: "" });

        // start render loop
//        this.#loopId = window.requestAnimationFrame((now) => this.render(now));
        this.#loopId = window.requestAnimationFrame(() => this.render());
    }

    onDrawMessage(buffer) {
        // if have a pending older buffer, 'give' it back to worker (skip frame rendering)
        if (this.#nextBuffer) {
            const tempBuffer = this.#nextBuffer;
            this.#nextBuffer = null;

            this.#worker.postMessage({
                type: "buffer",
                payload: { buffer: tempBuffer }
            }, [tempBuffer.buffer]);
        }

        // set next buffer to render
        this.#nextBuffer = buffer;
    }

    // TODO: need 'now' here? (can just render as fast as possible no?)
//    render(now) {
    render() {
        if (this.#nextBuffer !== null) {

//////////////////
// fake processing
const min = 100000;
const max = 500000;
const cpt = Math.floor(Math.random() * (max - min + 1)) + min
for (let i=0; i<cpt; ++i) {
//    console.log("RENDERING");
}
//////////////////

            // draw/render
            const floatbuffer = this.#nextBuffer;
            this.#nextBuffer = null;

            // render process
            //... clear canvas, draw each sprite...
            // TODO: useless here, as will be done in worker
            // then set first value to 0, to 'reset' it
            floatbuffer[0] = 0;

            // 'give' buffer back to worker
            // TODO: embed in 'setTimeout'? (seems unnecessary)
            this.#worker.postMessage({
                type: "buffer",
                payload: { buffer: floatbuffer }
            }, [floatbuffer.buffer]);
        }

        // TODO: other process?
        //...

        // TODO: move to start of method (?)
//        this.#loopId = window.requestAnimationFrame((now) => this.render(now));
        this.#loopId = window.requestAnimationFrame(() => this.render());
    }

    stop() {
        // TODO:
        // a. send stop message to worker (postMessage(stop)), which in turn closes itself (self.close)
        // OR
        // b. terminate worker (worker.terminate)

        // TODO: here?
        window.cancelAnimationFrame(this.#loopId);

    }

}