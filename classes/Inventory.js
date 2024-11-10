class Inventory {
    constructor(id, quantity) {
        this.id = id;
        this.quantity = quantity;
    }
}

const inventoryConverter = {
    toFirestore: (inventory) => {
        return {
            id: inventory.id,
            quantity: inventory.quantity,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Inventory(
            data.id,
            data.quantity
        );
    }
};

export { Inventory, inventoryConverter };