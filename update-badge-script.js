import fs from 'fs';
import core from '@actions/core';
import thingiverse from 'thingiverse-js';


const accessToken = "a634f6dfb236fa5db822d5eaab00c322";
let userName = "Topsee"

class Template {
    constructor(variableName, templateFile, outputFile) {
        this.variableName = variableName;
        this.templateFile = templateFile;
        this.outputFile = outputFile;
    }
}

let designsTemplate = new Template('designsCount', 'thingiverse-designs-template.svg', 'thingiverse-designs.svg')
let makesTemplate = new Template('makesCount', 'thingiverse-makes-template.svg', 'thingiverse-makes.svg')

let commitUpdates = false
let commitInfo = ""
let filesToAdd = ""

class ThingiStats {
    constructor(makesCount, designsCount, followersCount) {
        this.makesCount = makesCount;
        this.designsCount = designsCount;
        this.followersCount = followersCount;
    }
}

class TemplateUpdate {
    constructor(template, newValue) {
        this.template = template;
        this.newValue = newValue;
    }
}

thingiverse(`users/${userName}`, {token: accessToken}).then(res => {
    let makesCount = res.body.make_count
    let designsCount = res.body.count_of_designs
    let followersCount = res.body.count_of_followers
    return new ThingiStats(makesCount, designsCount, followersCount);
}).then(stats => {
    console.log('My stats ', stats);
    updateBadges(stats)
}).catch(err => {
    console.log(err);
    console.log(thingiverse.getError(err.response));
});

function updateBadges(stats) {
    updateBadge(new TemplateUpdate(makesTemplate, stats.makesCount))
    updateBadge(new TemplateUpdate(designsTemplate, stats.designsCount))
    setUpdateBanner(commitUpdates)
    setCommitInfo(commitInfo)
    setFilesToAdd(filesToAdd)
}


function updateBadge(update) {
    try {
        let template = update.template
        let templateData = readFile(template.templateFile);
        let compiledBadge = compileTemplate(templateData, template.variableName, update.newValue);
        let oldBadge = readFile(template.outputFile);

        if (oldBadge === compiledBadge) {
            console.info("Badge data has not changed. Skipping commit.");
        } else {
            commitUpdates = true
            commitInfo += template.variableName + ":" + update.newValue + " "
            filesToAdd += template.outputFile + " "
            console.info("Updating " + template.variableName + " badge...");
            fs.writeFileSync("./" + template.outputFile, compiledBadge);
            console.info("Updated " + template.outputFile + " successfully");

        }
    } catch (error) {
        console.error(error);
    }
}

function setUpdateBanner(value) {
    setOutput("UPDATE_BADGE", value)
}

function setFilesToAdd(value) {
    setOutput("FILES_TO_ADD", value)
}

function setCommitInfo(value) {
    setOutput("COMMIT_INFO", value)
}

/**
 * Output will be available to the next GitHub action step
 */
function setOutput(key, value) {
    core.setOutput(key, value);
}

function readFile(file) {
    return fs.readFileSync("./" + file, 'utf8')
}

function compileTemplate(templateData, variableName, newValue) {
    let variablePlacholder = "${" + variableName + "}";
    return templateData.replaceAll(variablePlacholder, newValue)
}
