class Post {
    constructor(id, author, title, body, dateCreated, tags = [], isPublic = true) {
        this.id = id || null;
        this.author = author || null;
        this.title = title || '';
        this.body = body || '';
        this.dateCreated = dateCreated || new Date().toISOString();
        this.tags = tags || [];
        this.isPublic = isPublic !== undefined ? isPublic : true;
    }
}

const postConverter = {
    toFirestore: (post) => ({
        id: post.id || null,
        author: post.author || null,
        title: post.title || '',
        body: post.body || '',
        dateCreated: post.dateCreated || new Date().toISOString(),
        tags: post.tags || [],
        isPublic: post.isPublic !== undefined ? post.isPublic : true
    }),
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Post(
            data.id,
            data.author,
            data.title,
            data.body,
            data.dateCreated,
            data.tags || [],
            data.isPublic !== undefined ? data.isPublic : true
        );
    }
};

export { Post, postConverter };