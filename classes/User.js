class User {
    constructor(username, coins, email, level, uid, xp) {
        this.username = username;
        this.coins = coins;
        this.email = email;
        this.level = level;
        this.uid = uid;
        this.xp = xp;
        this.agreed = false; // Default value for agreed field
    }
}

const userConverter = {
    toFirestore: (users) => {
        return {
            username: users.username,
            coins: users.coins,
            email: users.email,
            level: users.level,
            uid: users.uid,
            xp: users.xp,
            agreed: users.agreed
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        const user = new User(data.username, data.coins, data.email, data.level, data.uid, data.xp);
        user.agreed = data.agreed ?? false; // Use nullish coalescing to ensure default false
        return user;
    }
};

export { User, userConverter };