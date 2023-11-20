console.log("Popup script loaded.");

document.getElementById('resumeUpload').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) {
        console.log("No file selected.");
        return;
    }

    if (file.name.endsWith('.pdf')) {
        console.log("PDF file detected. Extracting text...");
        // For now, just log the file name
        console.log("PDF File Name:", file.name);
    } else if (file.name.endsWith('.txt')) {
        console.log("Text file detected. Reading content...");
        const content = await readFileAsText(file);
        console.log("Content:", content);
    } else {
        console.log("Unsupported file type.");
    }
});

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
}


document.getElementById('highlightAchievements').addEventListener('click', function() {
    sendToChatGPT(resumeContent, "Highlight the achievements in this resume.");
});

document.getElementById('improveTechnical').addEventListener('click', function() {
    sendToChatGPT(resumeContent, "Improve the technical jargon in this resume.");
});

document.getElementById('enhanceSoftSkills').addEventListener('click', function() {
    sendToChatGPT(resumeContent, "Enhance the description of soft skills in this resume.");
});

document.getElementById('optimizeManagement').addEventListener('click', function() {
    sendToChatGPT(resumeContent, "Optimize this resume for management roles.");
});

document.getElementById('optimizeEntryLevel').addEventListener('click', function() {
    sendToChatGPT(resumeContent, "Optimize this resume for entry-level roles.");
});

function sendToChatGPT(content, prompt) {
    const API_ENDPOINT = 'https://api.openai.com/v1/completions';
    const API_KEY = 'YOUR_API_KEY';

    const requestBody = {
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt + "\n\n" + content,
        temperature: 0,
        max_tokens: 500
    };

    document.getElementById('progressBar').style.display = 'block';
    document.getElementById('progressStatus').style.width = '50%';
    document.getElementById('progressStatus').innerText = 'Uploading...';

    fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        const improvedContent = data.choices[0].text.trim();
        displayImprovedResume(improvedContent);
        document.getElementById('progressStatus').style.width = '100%';
        document.getElementById('progressStatus').innerText = 'Done!';
    })
    .catch(error => {
        console.error("Error improving resume:", error);
        alert("Error improving resume. Please try again.");
    });
}

function displayImprovedResume(content) {
    document.getElementById('feedback').innerText = content;
}

browser.storage.local.get('extractedTextArray').then((result) => {
    if (result.extractedTextArray) {
        extractedTextArray = result.extractedTextArray;
    }
}).catch((error) => {
    console.error("Error fetching from storage:", error);
});
