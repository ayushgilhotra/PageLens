# PageLens

PageLens is a full stack website intelligence platform that analyzes any public website and gives useful information about its technical structure and SEO. It is built using React for the frontend and Spring Boot for the backend.

The idea behind this project is simple. Instead of manually inspecting a website for metadata headings images and other technical details the user can simply enter a website URL and get all the important information in one place.

The project performs real website analysis by fetching the live webpage parsing its HTML content and generating a detailed report. It does not use mock data or randomly generated values.

This project was developed as part of the Digital Heroes Software Development Engineering Internship Assignment.

---

# Features

PageLens can analyze any valid public website and provides information such as

* HTTP Status Code
* Response Time
* Page Title
* Meta Description
* Heading Analysis
* Word Count
* Image Analysis
* Favicon Detection
* Language Detection
* Character Encoding
* Viewport Detection
* Robots Meta Tag Detection
* Sitemap Detection
* HTTPS Verification
* SEO Score
* SEO Grade

Other features included in the project are

* Website analysis history
* Export analysis report
* Responsive user interface
* Real time backend integration
* Proper error handling
* Clean and simple user experience

---

# Tech Stack

## Frontend

React
Vite
JavaScript
Tailwind CSS
Framer Motion
React Router
Lucide React


## Backend

Java 17
Spring Boot 3
Spring Validation
Jsoup
JUnit 5
Mockito
Maven

---

# Project Structure

```
PageLens
│
├── frontend
│   ├── src
│   ├── public
│   ├── components
│   ├── pages
│   ├── services
│   └── assets
│
├── backend
│   ├── controller
│   ├── service
│   ├── parser
│   ├── dto
│   ├── util
│   ├── exception
│   ├── config
│   └── tests
│
└── README.md
```

The frontend is responsible for the user interface and communicates with the backend using REST APIs.

The backend performs the complete website analysis by fetching the webpage parsing the HTML and returning structured JSON data to the frontend.

---

# How It Works

The complete flow of the application is shown below.

```
User
↓
Enter Website URL
↓
React Frontend
↓
Spring Boot REST API
↓
Website Fetch using Jsoup
↓
HTML Parsing
↓
SEO Score Calculation
↓
JSON Response
↓
Frontend Dashboard

```

The frontend sends the website URL to the backend.

The backend validates the URL before making any network request.

After validation the backend downloads the webpage using Jsoup.

The HTML is parsed to extract useful information such as page title headings images metadata language viewport robots and many other details.

The extracted information is then passed to the SEO calculator which generates a deterministic SEO score based on predefined rules.

Finally the complete report is returned to the frontend where it is displayed in a clean and easy to understand format.

---

# Why I Built This Project

While learning web development I noticed that checking the technical details of a website usually requires using multiple online tools.
I wanted to build one application that could provide all the important information in a single place.
This project also helped me understand how frontend and backend applications communicate with each other through REST APIs and how HTML parsing works in real world applications.
During development I focused on writing clean code separating responsibilities properly and keeping the project easy to understand and maintain.

# Getting Started


Follow the steps below to run the project on your local machine.

## Prerequisites

Before running the project make sure the following software is installed on your system.

Java 17
Node.js
npm
Maven
Git

You can verify the installations using these commands.

```bash
java --version
node --version
npm --version
mvn --version
git --version
```

---

# Installation

Clone the repository.

```bash
git clone https://github.com/ayushgilhotra/PageLens.git
```

Go inside the project folder.

```bash
cd PageLens
```

---

# Running the Backend

Open a terminal and move to the backend folder.

```bash
cd backend
```

Install the dependencies and build the project.

```bash
mvn clean install
```

Start the Spring Boot application.

```bash
mvn spring-boot:run
```

The backend will start on

```
http://localhost:8080
```

---

# Running the Frontend

Open another terminal and move to the frontend folder.

```bash
cd frontend
```

Install all required packages.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

The frontend will start on

```
http://localhost:5173
```

Open the above URL in your browser to use the application.

---

# Environment Variables

Create a file named

```
.env
```

inside the frontend folder.

Add the following variable.

```env
VITE_API_BASE_URL=http://localhost:8080
```

This is used by the frontend to communicate with the Spring Boot backend.

---

# API Documentation

The application currently exposes one REST API.

## Analyze Website

**Endpoint**

```http
POST /api/v1/analyze
```

**Content Type**

```text
application/json
```

---

## Request Body

```json
{
  "url": "https://openai.com"
}
```

Replace the URL with any valid public website.

---

## Successful Response

The response contains detailed information about the website.

Example

```json
{
  "url": "https://openai.com",
  "httpStatus": 200,
  "responseTime": 312,
  "pageTitle": "OpenAI",
  "metaDescription": "Artificial Intelligence Research",
  "wordCount": 1456,
  "seoScore": 91,
  "seoGrade": "A"
}
```

The actual response contains additional information including heading analysis image analysis metadata language robots sitemap favicon HTTPS status and SEO breakdown.

---

# Error Responses

The application returns meaningful error messages when something goes wrong.

### Invalid URL

```json
{
  "message": "Please enter a valid URL."
}
```

### Website Not Reachable

```json
{
  "message": "Unable to fetch the website."
}
```

### Request Timeout

```json
{
  "message": "The website took too long to respond."
}
```

### Non HTML Content

```json
{
  "message": "Only HTML webpages can be analyzed."
}
```

---

# How to Use the Application

1)Open the application in your browser.

2)Enter a valid website URL in the input field.

3)Click the **Analyze Website** button.

4)Wait a few seconds while the backend analyzes the webpage.

5)The report will display important information including

* Page title
* Meta description
* HTTP status
* Response time
* Heading analysis
* Image analysis
* Word count
* SEO score
* SEO grade
* Technical metadata

Every successful analysis is automatically saved in the History page where previous reports can be viewed again.

---

# Testing

The backend includes unit tests for important parts of the application.

These tests cover

* URL validation
* HTML parsing
* SEO score calculation
* Service layer

To run all tests execute

```bash
mvn test
```

If all tests pass Maven will display a build success message.

Running the tests before making changes is a good way to verify that the existing functionality is working correctly.

# Design Decisions

While building this project I tried to keep the code simple easy to understand and easy to maintain. Some of the important design decisions are explained below.

## 1. Using Spring Boot for the Backend

I selected Spring Boot because it provides a clean structure for building REST APIs. It also makes request handling validation exception handling and dependency management much easier.

Separating the application into different layers like controller service parser and utility classes keeps the code organized and easier to maintain.

---

## 2. Using Jsoup for Website Analysis

Instead of using browser automation tools I used Jsoup to fetch and parse HTML pages.

Jsoup is lightweight fast and provides everything required for extracting website metadata headings images and other HTML elements.

Since this project focuses on HTML analysis Jsoup was a good choice because it keeps the backend simple without adding unnecessary complexity.

---

## 3. Deterministic SEO Score

The SEO score is calculated using predefined rules instead of random values.

Every website is evaluated using the same criteria which makes the score consistent and predictable.

This also makes the application easier to test because the same input always produces the same output.

---

# Challenges Faced

During development I faced a few challenges.

One challenge was handling different types of invalid URLs and making sure the application returned proper error messages instead of crashing.

Another challenge was parsing websites that have different HTML structures. Every website is designed differently so the parser had to handle missing tags and optional metadata safely.

Connecting the React frontend with the Spring Boot backend also required careful handling of API requests loading states and error responses.

Working through these problems helped me understand how frontend and backend applications communicate in a real project.

---

# Future Improvements

There are many features that can be added in future versions of this project.

Some possible improvements are

* Accessibility analysis
* Open Graph metadata analysis
* Structured data detection
* Canonical URL detection
* Broken link detection
* Performance metrics
* Lighthouse integration
* PDF report generation
* User authentication
* Dashboard with analytics
* Database support for storing reports
* Compare two websites
* Multi page website crawling

---

# What I Learned

This project helped me improve my understanding of full stack development.

Some of the things I learned while building PageLens are

* Building REST APIs using Spring Boot
* Connecting React with a backend API
* HTML parsing using Jsoup
* Exception handling
* Request validation
* Clean project structure
* API design
* Unit testing using JUnit
* Writing maintainable code
* Managing frontend state during API calls

Overall this project gave me practical experience in building a complete application from scratch.

---

# Acknowledgements

This project was developed as part of the Software Development Engineering Internship Assignment provided by Digital Heroes.

Building this application gave me the opportunity to work on a complete full stack project and apply concepts from both frontend and backend development.

---

# Author

Ayush Gilhotra

B.Tech Computer Science and Engineering

Chandigarh Group of Colleges Landran

GitHub:-

https://github.com/ayushgilhotra

LinkedIn:-

https://www.linkedin.com/in/ayush-gilhotra-18bb76336

---

# Thank You

Thank you for taking the time to review this project.

I hope the code structure documentation and implementation clearly reflect the effort that went into building this application.

I enjoyed working on this assignment and learned a lot throughout the development process. I appreciate the opportunity to demonstrate my skills through this project.
