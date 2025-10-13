const frontWebsiteRepository = require('../repository/frontWebsiteRepository')

async function getHeroSectionData(req, res) {
    const result = await frontWebsiteRepository.getHeroSectionData();
    if (!result) {
        return res.status(500).json({ message: "Some error occured", success: false })
    }
    return res.status(200).json({ success: true, data: result })
}

async function updateHeroData(req, res) {
    try {
        const {
            badgeText,
            heading1,
            heading2,
            description,
            stat1Value,
            stat2Value,
            stat3Value,
            floatingCard1Title,
            floatingCard1Subtitle,
            floatingCard2Title,
            floatingCard2Subtitle
        } = req.body;

        const result = await frontWebsiteRepository.updateHeroData(
            badgeText,
            heading1,
            heading2,
            description,
            stat1Value,
            stat2Value,
            stat3Value,
            floatingCard1Title,
            floatingCard1Subtitle,
            floatingCard2Title,
            floatingCard2Subtitle
        );

        if (!result) {
            return res.status(400).json({ message: "Failed to update hero section." });
        }

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error("Error in updateHeroData:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}


async function getCourses(req, res) {
    const result = await frontWebsiteRepository.getCourses();
    if (!result) {
        return res.status(500).json({ message: "There is some error", success: false });
    }
    return res.status(200).json({ success: true, data: result })
}


async function getAllCourses(req, res) {
    const result = await frontWebsiteRepository.getAllCourses();
    if (!result) {
        return res.status(500).json({ message: "There is some error", success: false });
    }
    return res.status(200).json({ success: true, data: result })
}

async function updateCourseById(req, res) {
    const { category, title, description, price, duration, level, image, featured, id } = req.body;
    const result = await frontWebsiteRepository.updateCourseById(category, title, description, price, duration, level, image, featured, id);
    if (!result) {
        return res.status(500).json({ message: "Course Not found", success: false })
    }
    return res.status(200).json({ success: true })
}

async function addCourse(req, res) {
    const { category, title, description, price, duration, level, image, featured } = req.body;
    console.log("iam bollena  " + featured)
    const result = await frontWebsiteRepository.addCourse(category, title, description, price, duration, level, image, featured);
    if (!result) {
        return res.status(500).json({ message: "There is some error occured", success: false })
    }
    return res.status(200).json({ success: true });
}

async function sendUsMessage(req, res) {
    const { fname, lname, email, phone, course, message } = req.body;
    const result = await frontWebsiteRepository.sendUsMessage(fname, lname, email, phone, course, message);
    if (result < 1) {
        return res.status(500).json({ message: "There is some error occurred", success: false })
    }
    return res.status(200).json({ success: true })
}

module.exports = { getCourses, getHeroSectionData, updateHeroData, getAllCourses, updateCourseById, addCourse, sendUsMessage }