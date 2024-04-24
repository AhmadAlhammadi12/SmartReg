const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));  // Serve static files from 'public' directory

// Endpoint to generate a course schedule
app.post('/generate-schedule', async (req, res) => {
    const { courses } = req.body;
    const prompt = courses.reduce((acc, course, index) => {
        return acc + `Include ${course.name} on ${course.days}. `;
    }, "Create a weekly schedule in ASCII excluding Friday, with each class length is 1 hour and a half. MW= monday and wedensday, TTh= Tuesday and Thursday (Only prompt the schedule at the top (without mentioning that this is the ASCII schedule) with a note under it explaining the schedule, and at the end tell the student if he does not like the schedule he can re-generate the schedule again). with the following courses: ");

    try {
        const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer *ChatGPT-API-HERE*`
            },
            body: JSON.stringify({
                model: "gpt-4-turbo",
                messages: [{ role: "user", content: prompt }]
            })
        });
        const data = await apiResponse.json();
        res.json({ schedule: data.choices[0].message.content });
    } catch (error) {
        console.error('Error making API request:', error);
        res.status(500).json({ message: 'Failed to generate schedule', error: error.toString() });
    }
});

app.post('/send-message', async (req, res) => {
    const { message } = req.body;
    try {
        const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer *ChatGPT-API-HERE*` 
            },
            body: JSON.stringify({
                model: "gpt-4-turbo",
                messages: [{ role: "system", content: "You are an AI academic advisor." }, { role: "user", content: message }]
            })
        });
        const data = await apiResponse.json();
        res.json({ response: data.choices[0].message.content });
    } catch (error) {
        console.error('Error making API request:', error);
        res.status(500).json({ message: 'Failed to communicate', error: error.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});