const { ActionStory, HorrorStory, RomanceStory, DetectiveStory } = require('./Story');

class StoryCreator {
    static create(data) {
        throw new Error("This method should be overridden!");
    }
}

class ActionStoryCreator extends StoryCreator {
    static create(data) {
        return new ActionStory(data);
    }
}

class HorrorStoryCreator extends StoryCreator {
    static create(data) {
        return new HorrorStory(data);
    }
}

class RomanceStoryCreator extends StoryCreator {
    static create(data) {
        return new RomanceStory(data);
    }
}

class DetectiveStoryCreator extends StoryCreator {
    static create(data) {
        return new DetectiveStory(data);
    }
}

module.exports = {
    StoryCreator,
    ActionStoryCreator,
    HorrorStoryCreator,
    RomanceStoryCreator,
    DetectiveStoryCreator
};
