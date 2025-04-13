// factories/StoryFactory.js
class Story {
    constructor(data) {
        this.genre = data.genre;
        this.title = data.title;
        this.description = data.description;
        this.author = data.author;
        this.thumbnail = data.thumbnail;
        this.number_of_chapters = data.number_of_chapters || 0;
        this.status = data.status || 'ongoing';
        
    }
}

class ActionStory extends Story {
    constructor(data) {
        super(data);
        this.genre = "Action";
    }
}

class HorrorStory extends Story {
    constructor(data) {
        super(data);
        this.genre = "Horror";
    }
}

class RomanceStory extends Story {
    constructor(data) {
        super(data);
        this.genre = "Romance";
    }
}

class DetectiveStory extends Story {
    constructor(data) {
        super(data);
        this.genre = "Detective";
    }
}

class StoryFactory {
    static createStory(genre, data) {
        console.log('data',genre);
        switch (genre.toLowerCase()) {
            case "action":
                return new ActionStory(data);
            case "horror":
                return new HorrorStory(data);
            case "romance":
                return new RomanceStory(data);
            case "detective":
                return new DetectiveStory(data);
            default:
                throw new Error("Genre not supported");
        }
    }
}

module.exports = StoryFactory;