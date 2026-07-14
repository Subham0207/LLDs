# Problem statement
`
An elevator system manages multiple elevators serving different floors in a building. When someone requests an elevator, the system decides which one to dispatch. Once inside, passengers select their destination floors. The system needs to move elevators efficiently while handling multiple concurrent requests.
`

# Solution
- elevator on floor 0 and heading to floor 9. User requests on floor 5. The elevator should stop.
    - upStops: bool[], downStops: bool[]
- Using Chain of responsibility for only 2 states might be overkill. See if another pattern like Strategy suffices.
- validation checks for dirty floors.

# Requirement
## User action
- User can request elevator. system decides which elevator to dispatch.
- In elevator, User can select one or more destination floor.
## system contraints
- system manages 3 elevator serving 10 floor ( 0 to 9)
- system decides which elevator to dispatch.
- use tick() to advance time in elevator
- Elevator stops in two ways - 
    - Hall calls - user outside requested
    - destionation - user inside requested
## NFR
- system handles multiple concurrent pickup request across floors
## Errors
- Invalid request should be rejected ( return false)
    - Non existent floor
    - request to same floor
## out of scope
- weight capacity and passenger limits
- door open/close
- emergency stop
- dynamic floor/elevator configuration


# Core entities, relationship, state modelling
- User
- Elevator
- Floor
- User Request
    - Hall calls
    - Destination
- ElevatorService

# Class Design

Class User
{
    id: string;
}

class Elevator
{
    id: string;
    isBusy: bool;
    currentFloor;
    TargetFloor;
    speed;

    move(dt: number)
    {
        if(currentFloor !== targetFloor)
        {
            const direction = Math.clamp(currentFloor - targetFloor,-1,1);
            currentFloor+=dt * speed * direction;
        }
    }
}

Class UserRequest
{
    type: HALL_CALL | SetDest;
    elevatorId?: string;
    floor;
}

interface requestHandler{
    bool handle();
};

class SetDestHandler implments requestHandler{
    next: requestHandler;
    bool handle(userRequest, elevators)
    {
        if(userRequest.type !== SetDest)
            return next.handler(userRequest);
        
        // select a non busy elevator
        const elevator elevators.filter(x => x.id === userRequest.id);
        elevator.target = userRequest.floor;
        return true;
    }
}

class hallCallHandler implments requestHandler{
    next: requestHandler;
    bool handle(userRequest, elevators)
    {
        if(userRequest.type !== HALL_CALL)
            return next.handler(userRequest);
        
        // select a non busy elevator
        const elevator = elevators.filter(x => !x.isBusy)[0];
        elevator.target = userRequest.floor;
        return true;
    }
}

Class ElevatorService
{
    handler;
    elevators: Array<Elevator>;
    minFloor: number
    maxFloor: number
    eventSystem: EventSystem;

    constructor(EventSystem)
    {
        minFloor = 0;
        maxFloor = 9;

        elevators = new Array<Elevator>();
        elevators.add(new Elevator('1', false, 0,0));
        elevators.add(new Elevator('2', false, 0,0));
        elevators.add(new Elevator('3', false, 0,0));
        eventSystem = EventSystem;

        eventSystem.on('ElevatorRequest',onRequest);
    }

    onTick(dt)
    {
        for(let elevator of elevators)
        {
            elevator.move(dt)
        }
    }

    onRequest(req: UserRequest)
    {   //validaiton checks
        handler.handle(req, elevators);
    }
}