const df = require('durable-functions');
const fs = require('fs');
const path = require('path');

df.app.orchestration('MainOrchestrator', function* (context) {
    const config = context.df.getInput(); // Get the configuration JSON object
    context.log(`Received configuration: ${JSON.stringify(config)}`);

    let secondLevelOrchestratorName;
    if (config.orchestrator === "default") {
        secondLevelOrchestratorName = "DefaultSubOrchestrator";
    } else {
        // Add logic to select other orchestrators if required
    }

    let results = {};
    for (const step of config.executionSteps) {
        const subOrchParam = {
            results,
            step
        };
        results = yield context.df.callSubOrchestrator(secondLevelOrchestratorName, subOrchParam);
    }
    return results;
});

(function() {
    const activityFunctionsDir = path.join(__dirname, '../activity-functions');
    const filesaf = fs.readdirSync(activityFunctionsDir);

    filesaf.forEach(file => {
        if (file.endsWith('.js')) {
            require(path.join(activityFunctionsDir, file)); // Load activity functions
        }
    });

    const subOrchestratorDir = path.join(__dirname, 'sub-orchestrators');
    const filesso = fs.readdirSync(subOrchestratorDir);

    filesso.forEach(file => {
        if (file.endsWith('.js')) {
            require(path.join(subOrchestratorDir, file)); // Load sub-orchestrators
        }
    });
})();
