/**
 * Timer.ts
 * A flexible and reusable Timer class for managing time intervals,
 * with support for pausing, resetting, and checking elapsed time.
 */
export class Timer {
    constructor(timePeriodMs) {
        this.timePeriod = timePeriodMs;
        this.delta = 0;
        this.timeSinceLastUpdate = this.getTimeNow();
        this.isTimerPaused = false;
        this.accumulatedTime = 0;
    }
    pause() {
        this.isTimerPaused = true;
    }
    resume() {
        this.isTimerPaused = false;
        this.timeSinceLastUpdate = this.getTimeNow();
    }
    /**
     * Checks if the timer has passed its time period.
     * Optionally resets the timer upon success.
     * @param reset Automatically reset the timer if time has passed.
     * @returns True if time has passed, false otherwise.
     */
    hasTimePeriodPassed(reset = true) {
        if (!this.isTimerPaused && this.delta >= this.timePeriod) {
            if (reset)
                this.reset();
            return true;
        }
        return false;
    }
    /**
     * Updates the timer. Call this in your game loop or update cycle.
     */
    update() {
        if (!this.isTimerPaused) {
            const now = this.getTimeNow();
            const elapsed = now - this.timeSinceLastUpdate;
            this.delta += elapsed;
            this.accumulatedTime += elapsed;
            this.timeSinceLastUpdate = now;
        }
    }
    reset() {
        this.delta = 0;
        this.accumulatedTime = 0;
        this.timeSinceLastUpdate = this.getTimeNow();
        this.isTimerPaused = false;
    }
    getAccumulatedTime() {
        return this.accumulatedTime;
    }
    getTimeLeft() {
        return Math.max(0, this.timePeriod - this.delta);
    }
    getTimeLeftInSeconds() {
        return this.getTimeLeft() / 1000;
    }
    getTimeNow() {
        return Date.now();
    }
    isPaused() {
        return this.isTimerPaused;
    }
}
