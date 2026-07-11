enum eventNames {
    InventoryArrival =  'InventoryArrival'
}

interface Event{
    getName(): eventNames;
}
class InventoryArrival implements Event{
    getName(): eventNames{return eventNames.InventoryArrival;}
}

interface Handler{
    execute(registry: Map<string,()=>{}>, eventName: string): void;
};

class InventoryArrivalHandler{};
class OrderShippedHandler{};
class StockTransferEventHandler{};


class EventService
{
    private readonly registery: Map<string, ()=>{}>;
    private readonly queue: Event[]; // body of the event
    private readonly handlers: Handler[];

    constructor()
    {
        this.registery = new Map<string,()=>{}>();
        this.queue = new Array<Event>(); 
        this.handlers = new Array<Handler>();
    }

    on(eventName: string, handler: ()=>{})
    {
        this.registery.set(eventName, handler);
    }

    flush()
    {
        this.queue.forEach( x => 
        {

            //opportunity to use chain of responsibility principal ( handlers chain )
           this.handlers.forEach(handler => {
                handler.execute(this.registery, x.getName());
           })
        }
        )

        this.queue.clear();
    }
}