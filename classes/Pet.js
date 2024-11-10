class Pet {
    constructor(id, level, name, type, xp) {
        this.id = id;
        this.level = level;
        this.name = name;
        this.type = type;
        this.xp = xp;
    }
}

const petConverter = {
    toFirestore: (pet) => ({
        id: pet.id,
        level: pet.level,
        name: pet.name,
        type: pet.type,
        xp: pet.xp
    }),
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Pet(data.id, data.level, data.name, data.type, data.xp);
    }
};

export { Pet, petConverter };