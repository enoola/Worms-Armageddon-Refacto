/**
 * Timer.ts
 * A flexible and reusable Timer class for managing time intervals,
 * with support for pausing, resetting, and checking elapsed time.
 */
export class Timer {
    private timeSinceLastUpdate: number;
    private delta: number;
    private readonly timePeriod: number;
    private isTimerPaused: boolean;
    private accumulatedTime: number;

    constructor(timePeriodMs: number) {
        this.timePeriod = timePeriodMs;
        this.delta = 0;
        this.timeSinceLastUpdate = this.getTimeNow();
        this.isTimerPaused = false;
        this.accumulatedTime = 0;
    }

    pause(): void {
        this.isTimerPaused = true;
    }

    resume(): void {
        this.isTimerPaused = false;
        this.timeSinceLastUpdate = this.getTimeNow();
    }

    /**
     * Checks if the timer has passed its time period.
     * Optionally resets the timer upon success.
     * @param reset Automatically reset the timer if time has passed.
     * @returns True if time has passed, false otherwise.
     */
    hasTimePeriodPassed(reset: boolean = true): boolean {
        if (!this.isTimerPaused && this.delta >= this.timePeriod) {
            if (reset) this.reset();
            return true;
        }
        return false;
    }

    /**
     * Updates the timer. Call this in your game loop or update cycle.
     */
    update(): void {
        if (!this.isTimerPaused) {
            const now = this.getTimeNow();
            const elapsed = now - this.timeSinceLastUpdate;
            this.delta += elapsed;
            this.accumulatedTime += elapsed;
            this.timeSinceLastUpdate = now;
        }
    }

    reset(): void {
        this.delta = 0;
        this.accumulatedTime = 0;
        this.timeSinceLastUpdate = this.getTimeNow();
        this.isTimerPaused = false;
    }

    getAccumulatedTime(): number {
        return this.accumulatedTime;
    }

    getTimeLeft(): number {
        return Math.max(0, this.timePeriod - this.delta);
    }

    getTimeLeftInSeconds(): number {
        return this.getTimeLeft() / 1000;
    }

    getTimeNow(): number {
        return Date.now();
    }

    isPaused(): boolean {
        return this.isTimerPaused;
    }
}