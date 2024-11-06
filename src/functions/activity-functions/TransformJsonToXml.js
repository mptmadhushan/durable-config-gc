const df = require("durable-functions");

module.exports = df.app.activity("TransformJsonToXml", async (input) => {
    const { name, birthday, city } = input;

    // Calculate age
    const birthDate = new Date(birthday);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();

    // Convert JSON to XML format
    const xmlOutput = `
        <Person>
            <Name>${name}</Name>
            <Birthday>${birthday}</Birthday>
            <City>${city}</City>
            <Age>${age}</Age>
        </Person>
    `;

    return xmlOutput;
});
