# Inventory Management

1. Requirements
- track product, stock, warhouse
- new order event
- inventory arrival event -> add stock to a warhouse
- order ship event -> deduct stock from the warhouse
- product stock low in warhouse event -> to managers.
    -  product stock low threshold configurable per warehouse
- transfer inventory b/w warhouse
    - StockTransferEvent
        - REQ_RECIEVED
        - INTRANSIT
        - DONE
- What happens when event occurs
    - keep this pluggable - interface only (strategy pattern)
Errors
- No stock
- product not found
Out-of scope
- authentication/authorization
- DB layer
- no ui
Non functional requirements
- extensibility: support more events ?
- concurrent product orders ?
- Memory efficiency

1. Core entities, State model and relationship
- product
- warehouse
- Events
    - inventory arrival
    - order ship
    - product stock low
    - new order event
- stock low threshold config{
    productId,
    warehouseId,
    threshold
}
- NotificationInterface{
    send(event)
}

2. Class Design

class Product{
    Id: string;
}

class StockLowConfig{
    productId,
    warehouseId,
    threshold
}

class warehouse{
    Id: string;
    productInventory: Map<Product, number>;
    archiveInventory: Map<Product, number>;
    configs: StockLowConfig[];
}


Interface Event{   
}

class StockTransferEvent
{
    status: REQ_RECIEVED | INTRANSIT | DONE;
    InventoryDiff;
}

class InventoryDiff
{
    Product:
        productId;
        quantity;
        warhouseId;
}

class InventoryArrival: Event{
    private:
        InventoryDiff
}

class OrderShipped: Event{
    private:
        InventoryDiff
}

// order placed for quantity and warehouse chosen
class orderPlaced: Event{
    private:
        InventoryDiff
}

interface NotificationInterface{
    send(event: Event)
}

class InventoryService
{
    constructor(warehouses, notificationsystem)
    {
        this.warehouses = warehouses;
        this.notification = notificationsystem;
    }

    AddToInventory(payload: InventoryDiff)
    {
        const warehouse = warehouses.find( x => x.id === payload.warehouseId);
        warehouse.products.add(event.product, event.quantity);
    }

    archiveFromInventory(payload: inventoryDiff)
    {
        const warehouse = warehouses.find( x => x.id = payload.warehouseId);
        const productStock = warehouse.products.get(payload.productId);
        if(productstock >= payload.quantity)
            warehouse.archiveInventory.set(payload.productId, payload.quantity)
        else
            notification.send("Product quantity insufficient, unable to transfer to another warehouse");
    }

    removeFromInventory(payload: inventoryDiff)
    {
        const warehouse = warehouses.find( x => x.id = payload.warehouseId);
        const productStock = warehouse.products.get(payload.productId);
        productStock -= payload.quantity;
        
        if(checkBreach(payload.productId, productStock))
        {
            notification.send('inventory stock for product running low');
        }

        warehouse.product.set(payload.productId, productStock)

    }

    private:
        warehouses: Warehouse[];
        notification: INotification;
}

const inventoryService = InventoryService();
const evtService = EventDispatcherService();

evtService.on(InventoryArrival, (payload: inventoryDiff) => {
    inventoryService.AddToInventory(payload);
});

evtService.on(OrderShipped, (payload: inventoryDiff) => {
    inventoryService.removeFromInventory(payload);
})

evtService.on(StockTransferEvent, (event, payload: InventoryDiff) => {
    if(event.status === REQ_RECIEVED)
        inventoryService.archiveFromInventory(payload);
    if(event.status === IN_TRANSIT)
        inventoryService.removeFromInventory(payload);
})