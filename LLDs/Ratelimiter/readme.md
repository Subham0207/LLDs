# Rate limiter

1. Requirements

- Client -> (ratelimiter, backend service)
- Rate limiter algorithms
    - sliding window
    - fixed window
    - token based
- ratelimitkey: ipaddress
- rate limit threshold/policy: 100req/min
- return true/false from ratelimiter
    - if true proceed to call backend service
    - false return 429 -- too many request
- Errors
    - invalid rate limit key
    - 429 exception
- out of scope
    - Donot use Redis, use inmemory storage.
    - Authentication and authorization
- Non functional requirements
    - extensibility ( strategy pattern): support any rate limit algorithms
    - two concurrent request from same ip. Rate limit one of them if threshold breached.

2. Core entities

- Client
- RateLimiter algorithm interface
    - ratelimitpolicy
- request
    - ratelimitkey

3. Class Design

Interface RateLimiter
{
    public:
        bool checkLimit(ipAddr: string);
}

class SlidingWindow implements Ratelimiter
{
    public:
        constructor(RateLimitPolicy policy);
        bool checkLimit(ipAddr: string);
    private:
        Map<ratelimitkey: string, timestamps: number[]>
}
class FixedWindow implements Ratelimiter
{
    public:
        constructor(RateLimitPolicy policy);
        bool checkLimit(ipAddr: string);
    private:
        Map<ratelimitkey: string, 
        {
            date: TimeStamp,
            reqCount: number
        }
        >
}
class TokenBased implements Ratelimiter
{
    public:
        constructor(RateLimitPolicy policy);
        bool checkLimit(ipAddr: string);
    private:
    //  use lst req to fill tokens when new calls are made
        Map<rateLimitKey: string, {
            tokens,
            lastReqTimestamp
        }>
}


class ClientService(req: Request)
{
    private:
        rl;
        service;
    public:
    constructor(BackendService service, RateLimiter rl);

    get(req, res)
    {
        const proceed = rl.checkLimit(req.ipaddr);
        if(proceed)
            service.get()
        else
            throw(429, Too many request)
    }
}