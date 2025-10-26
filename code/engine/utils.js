/* utils.js */

// TODO: test both functions!
export class Lerp {

    static lerp(start, target, duration, timeSinceStart) {
        value = start;
        if (timeSinceStart > 0.0 && timeSinceStart < duration) {
            const range = target - start;
            const percent = timeSinceStart / duration;
            value = start + (range * percent);
        } else if (timeSinceStart >= duration) {
            value = target;
        }
        return value;
    }

    static ease(start, target, duration, timeSinceStart) {
        value = start;
        if (timeSinceStart > 0.0 && timeSinceStart < duration) {
            const range = target - start;
            const percent = timeSinceStart / (duration / 2.0);
            if (percent < 1.0) {
                value = start + (range / 2.0) * percent ** 3;
            } else {
                const shiftedPercent = percent - 2.0;
                value = start + (range / 2.0) *  (shiftedPercent ** 3 + 2.0);
            }
        } else if (timeSinceStart >= duration) {
            value = target;
        }
        return value;
    }
}
