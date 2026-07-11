# Low Level Design pointers

- statemachine design: enums (Like: START | INPROCESS | FINISHED)
- Interface/abstract classes aka Strategy pattern: support extensibility/multiple forms (Like: types of rate limiter implementation)
- Service class: managing multiple single responsible objects (Like: BookingService)
- Don't introduce external dependency like redis. Use a obj/map to store data.

# Framework for LLD

1. Requirements
    - primary capabilities
    - errors
        - Timeouts - 
        - Deadlocks - infinite wait
        - Invalid input - max size, format, location, etc.
    - out of scope
        - Auth/Author
    - non functional requirements
        - extensibility
        - concurrency and thread safety
        - Memory efficiency
2. Core entities, Relationship, and state modelling ( if any for stateful systems)
3. Class Design
4. Implmentation
5. Verify your own code...

# Important design principles
- YAGNI
- DRY
- Separation of concern
- SOLID
    - Single Responsibility
    - Open for extension/closed for modification
    - Liskov substitution
    - Dependency inversion
- Composition - has a relationship
- CQRS - Command Query Responsibility Segragation

# Imporant design pattern
Creational pattern
- Factory
- Builder
- Singleton
Structural pattern
- Decorator
- Facade
Behavioural Pattern
- Strategy
- Observer
    - notifyObservers(){ for observer in observers{ observer.update() } }
- Statemachine
    - enums for states
- chain of responsibility principle
    - class BaseHandler; class Handler: BaseHandler; build a chain of Handler using Handler.next
- circuit breaker

# Concurrency
1. Correctness
    - Check then act
        - Atomic operation - Locks, mutex or semaphores ( CPP ), synchronized lock ( java )
    - Read modify write - Hardware level atomic operation
        - AtomicInteger in java, python uses lock for this as well.
2. Coordination
    - blocking task queue - thread sleeps until there is work in queue
    - bounded blocking queue - backpressure
3. Scarcity - to access low available resource
    - semaphores - threads acquire permits, try execute code and finally release permit
    - for state management like connections bounded blocking queue - take, try code finally put back the connection.


Lock and Atomic primitives
`
    // when multiple variables are involved
    lock{
        ...    
    }

    // single variable is involved
    AtomicInteger a = 0;
    a.increment();

    // try lock
    try{
        while(retry < maxRetries)
        {
            retry++;                    
            if(lock.tryLock(500ms))
            {
                acquired=true;
                ...
            }
        }
    } finally {
        !acquired && throw error();
        lock.release();
    }
`

Bounded blocking queue
`
    BlockingQueue<Task> queue = new blockingQueue<Task>(1000);
    queue.put(task);

    while true:
        const task = queue.take();
        await task();
`

Semaphore
`
    Semaphore _sem = new Semaphore(5);

    _sem.take();
    try{
        await download();
    }
    finally{
        _sem.release();
    }

    using bounded blocking queue
    const task = queue.take();
    try{
        await download();
    }finally{
        queue.put(task);
    }
`