type RatelimitPolicy = {
    maxRequests: number;
    timeWindowSize: number;
}

interface Ratelimiter {
    checkLimit(ipAddr: string): boolean;
}

export class SlidingWindow implements Ratelimiter {
    private readonly rl: RatelimitPolicy;
    private storage: Map<string, number[]>; // ratelimitkey: string, timestamps: number[]
    constructor(rl: RatelimitPolicy) { 
        this.rl = rl;
        this.storage = new Map<string, number[]>();
    }

    // now = 8:25pm
    // windowStartBoundary = 8:25pm - 1min = 8:24pm
    // sliding: filter out timestamps greater than windowstart boundary
    // then count if the requests are within max allowed request
    checkLimit(ipAddr: string): boolean {
        const now = Date.now();
        const windowStartBoundary = now - this.rl.timeWindowSize;
        let timestamps = this.storage.get(ipAddr) || [];
        timestamps = timestamps.filter(timestamp => timestamp > windowStartBoundary);
        if(timestamps.length >= this.rl.maxRequests)
        {
            this.storage.set(ipAddr, timestamps);
            return false;
        }
        timestamps.push(now);
        this.storage.set(ipAddr, timestamps);
        return true;
    }
}

interface FixedWindowBucket
{
    windowStartTime: number;
    count: number;
}

export class FixedWindow implements Ratelimiter {
    private readonly rl: RatelimitPolicy;
    private storage: Map<string, FixedWindowBucket>; // ratelimitkey: string, timestamps: number[]
    constructor(rl: RatelimitPolicy) { 
        this.rl = rl;
        this.storage = new Map<string, FixedWindowBucket>();
    }
    // now
    // currentWindowStart = now map any arbitrary time to start of the time window.
    // if new client or last window is old, reset the bucket
    // in Current time window
    //  - if count > maxrequest return false
    //  - increament the count and return true
    checkLimit(ipAddr: string): boolean {
        const now = Date.now();
        const currentWindowStart = Math.floor(now / this.rl.timeWindowSize) * this.rl.timeWindowSize;
        let bucket = this.storage.get(ipAddr);
        if(!bucket || bucket.windowStartTime !== currentWindowStart)
        {
            //new window
            bucket = {windowStartTime: currentWindowStart, count: 0};   
        }

        if(bucket.count >= this.rl.maxRequests)
        {
            return false;
        }

        bucket.count++;
        this.storage.set(ipAddr, bucket);
        return true;
    }
}

interface TokenBucket {
    tokens: number;
    lastRefilled: number;
}

export class TokenBucketRatelimiter implements Ratelimiter{
    private readonly rl: RatelimitPolicy;
    private storage: Map<string, TokenBucket>; // ratelimitkey: string, timestamps: number[]
    private refillRatePerMs: number;
    constructor(rl: RatelimitPolicy) { 
        this.rl = rl;
        this.storage = new Map<string, TokenBucket>();
        this.refillRatePerMs = this.rl.maxRequests / this.rl.timeWindowSize;
    }

    checkLimit(ipAddr: string): boolean {
        const now = Date.now();
        let bucket = this.storage.get(ipAddr);
        if(!bucket)
        {
            bucket = {tokens: this.rl.maxRequests, lastRefilled: now};
        }
        else
        {
            const elapsedTime = now - bucket.lastRefilled;
            const tokensToAdd = elapsedTime * this.refillRatePerMs;
            bucket.tokens = Math.min(this.rl.maxRequests, bucket.tokens + tokensToAdd);
            bucket.lastRefilled = now;
        }

        if(bucket.tokens >= 1)
        {
            bucket.tokens -= 1;
            this.storage.set(ipAddr, bucket);
            return true;
        }
        return false;
    }
}