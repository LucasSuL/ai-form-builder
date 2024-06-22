/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
  generationConfig,
  // safetySettings: Adjust safety settings
  // See https://ai.google.dev/gemini-api/docs/safety-settings
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Description: A student registration form for a coding work shop on React. Based on the description, please give me the form in json format with form title, form subheading, form field, form name, placeholder name, form label",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "formTitle": "React Coding Workshop Registration",\n  "formSubheading": "Join us for an immersive workshop to learn the fundamentals of React.",\n  "formName": "registrationForm",\n  "fields": [\n    {\n      "type": "text",\n      "label": "Full Name",\n      "name": "fullName",\n      "placeholder": "Enter your full name"\n    },\n    {\n      "type": "email",\n      "label": "Email Address",\n      "name": "email",\n      "placeholder": "Enter your email address"\n    },\n    {\n      "type": "select",\n      "label": "Experience Level",\n      "name": "experienceLevel",\n      "options": [\n        {\n          "value": "beginner",\n          "label": "Beginner"\n        },\n        {\n          "value": "intermediate",\n          "label": "Intermediate"\n        },\n        {\n          "value": "advanced",\n          "label": "Advanced"\n        }\n      ]\n    },\n    {\n      "type": "textarea",\n      "label": "Tell us about your coding background (optional)",\n      "name": "codingBackground",\n      "placeholder": "Share your experience with coding and any prior knowledge of React"\n    },\n    {\n      "type": "checkbox",\n      "label": "I have read and agree to the workshop terms and conditions",\n      "name": "termsAndConditions",\n      "required": true\n    },\n    {\n      "type": "submit",\n      "label": "Register Now"\n    }\n  ]\n}\n```\n\nThis JSON object defines the structure of the React coding workshop registration form. It includes:\n\n* **formTitle:** The title of the form.\n* **formSubheading:** A brief description of the form.\n* **formName:** A name for the form, which can be useful for form handling in your code.\n* **fields:** An array of objects, each representing a form field.\n  * **type:** The type of form field (text, email, select, textarea, checkbox, submit).\n  * **label:** The label displayed next to the field.\n  * **name:** The name of the field, used to identify it in the form submission data.\n  * **placeholder:** Placeholder text displayed in the field when it\'s empty.\n  * **options:** An array of options for select fields.\n  * **required:** Whether the field is required (for checkbox and other fields).\n\nYou can use this JSON data to build your form dynamically using a JavaScript framework or library.\n',
        },
      ],
    },
  ],
});


