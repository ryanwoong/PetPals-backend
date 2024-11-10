class Item {
    constructor(id, name, cost, description) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.description = description
    }
}

const itemConverter = {
    toFirestore: (item) => ({
        id: item.id,
        name: item.name,
        cost: item.cost,
        description: item.description
    }),
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Item(data.id, data.name, data.cost, data.description);
    }
};

export { Item , itemConverter };