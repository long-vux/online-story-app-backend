// StoryFactory.js

const {
    ActionStoryCreator,
    HorrorStoryCreator,
    RomanceStoryCreator,
    DetectiveStoryCreator
} = require('./StoryCreator');

class StoryFactory {
    static createStory(genre, data) {
        console.log('Creating story for genre:', genre);
        switch (genre.toLowerCase()) {
            case "action":
                return ActionStoryCreator.create(data);
            case "horror":
                return HorrorStoryCreator.create(data);
            case "romance":
                return RomanceStoryCreator.create(data);
            case "detective":
                return DetectiveStoryCreator.create(data);
            default:
                throw new Error("Genre not supported");
        }
    }
}

module.exports = StoryFactory;