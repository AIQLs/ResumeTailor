/*THIS IS IN DEVELOPMENT. DO NOT EXPECT A FULLY WORKING SCRIPT AT THIS TIME.
DO FEEL FREE TO USE THE CHATGPT PORTION AS IT DOES WORK, YOU WILL NEED TO EDIT
-*/


console.log("Popup script loaded.");

document.getElementById('resumeUpload').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) {
        console.log("No file selected.");
        return;
    }

    
    //this is a check to ensure the correct documents are selected otherwise
    //nothing will happen and displays to console.
    if (file.name.endsWith('.pdf')) {
        console.log("PDF file detected. Extracting text...");
        // For now, just log the file name, next the pdf.js needs to be implemented
        //annotations will need to be utilized initially until a full extraction system
        //is able to extract raw values and convert to a readable and editable format.
        console.log("PDF File Name:", file.name);
    } else if (file.name.endsWith('.txt')) {
        console.log("Text file detected. Reading content...");
        const content = await readFileAsText(file);
        console.log("Content:", content);
    } else {
        console.log("Unsupported file type.");
    }
});



//promise is used to asynchonrously execute the callbacks, so
//it first will run 'resolve', if successful it will not run 
//'reject', if 'result' fails then it will execute 'reject'
//and display/send to console the error.
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
}


//Currently set so a user uploads a document, the buttons are set a click function, 
//it then will send the entire document contents to the gpt model and provide the prompt.

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
    const API_KEY = '/*API KEY*/';

    const requestBody = {
        model: "/*model choice*/",

        //TBF - the string when you call sendToChatGPT(resumeContent,"string") is the prompt
        //it then sends the prompt first, then empty space to seperate the resume content
        //temperature is used for randomness, this is a double value ranging from 0.0-2.0
        //a higher temperature leads to a more focused response based on the prompt
        //a lower temperature will provide more random response, so what this does if you 
        //have it at 2.0, the AI will typically respond with the same answer, if you set
        //it lower, it will generate random/not the same responses. then the token value 
        //is for how many characters in a response it can generate upto. this does not
        //mean the AI will respond with that many characters, it just has the ability to.
        //
        prompt: prompt + "\n\n" + content,
        temperature: 0.0,
        max_tokens: 1000

    };

    document.getElementById('progressBar').style.display = 'block';
    document.getElementById('progressStatus').style.width = '50%';
    document.getElementById('progressStatus').innerText = 'Uploading...';


    //this is the start of retrieving the response the AI generated for
    //the resume, then it will display the response in a 
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
