class User {
    constructor (username, coins, email, level, uid, xp) {
        this.username = username;
        this.coins = coins;
        this.email = email;
        this.level = level;
        this.uid = uid;
        this.xp = xp;
    } 
}

const userConverter = {
    toFirestore: (users) => {
        return {
            username: users.username,
            coins : users.coins,
            email : users.email,
            level : users.level,
            uid : users.uid,
            xp : users.xp
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.username, data.coins, data.email, data.level, data.uid, data.xp);
    }
}

export { User, userConverter };