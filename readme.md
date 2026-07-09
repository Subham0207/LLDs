# Low Level Design pointers

- statemachine design: enums (Like: START | INPROCESS | FINISHED)
- Interface/abstract classes aka Strategy pattern: support extensibility/multiple forms (Like: types of rate limiter implementation)
- Service class: managing multiple single responsible objects (Like: BookingService)

# Framework for LLD

1. Requirements
    - primary capabilities
    - errors
        - Timeouts
        - Deadlocks
        - Invalid input
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
- Statemachine