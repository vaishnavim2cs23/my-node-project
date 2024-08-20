const express = require('express');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 8080;

// Example user data
const users = [
    { name: 'John Doe', email: 'john.doe@example.com' },
    { name: 'Jane Smith', email: 'jane.smith@example.com' }
    // Add more user objects as needed
];

// Serve static files from the 'public' directory (for userList.ejs)
app.use(express.static('public'));

// Endpoint to render the userList.ejs template
app.get('/', async (req, res) => {
    try {
        // Render the EJS template with user data
        const templatePath = path.resolve(__dirname, 'userList.ejs');
        const templateContent = await fs.readFile(templatePath, 'utf8');
        const renderedHtml = ejs.render(templateContent, { users });

        // Send rendered HTML as response
        res.send(renderedHtml);
    } catch (error) {
        console.error('Error rendering template:', error);
        res.status(500).send('Failed to render template');
    }
});

// Endpoint to generate PDF from userList.ejs template
app.get('/generate-pdf', async (req, res) => {
    try {
        // Render the EJS template with user data
        const templatePath = path.resolve(__dirname, 'userList.ejs');
        const templateContent = await fs.readFile(templatePath, 'utf8');
        const htmlContent = ejs.render(templateContent, { users });

        // Launch a headless browser
        const browser = await puppeteer.launch();

        // Create a new page
        const page = await browser.newPage();

        // Set the HTML content of the page
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate PDF from HTML
        const pdfPath = path.resolve(__dirname, 'generated-pdf', 'user-list.pdf');
        await page.pdf({
            path: pdfPath, // path to save the PDF file
            format: 'A4', // paper format
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            }
        });

        console.log(`PDF generated successfully at ${pdfPath}`);

        // Close the browser
        await browser.close();

        // Send the PDF file as a response
        res.download(pdfPath, 'user-list.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Failed to generate PDF');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
