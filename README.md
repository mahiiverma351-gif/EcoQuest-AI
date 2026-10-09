# 🌿 EcoQuest AI — Explore the Living World

**Less scrolling. More wonder.**

EcoQuest AI is an AI-powered nature companion built with HTML, CSS, and vanilla JavaScript. It encourages people to spend more time outdoors, explore their surroundings, complete nature challenges, and document their discoveries with the help of open-weight AI.

Instead of keeping people glued to their screens, EcoQuest AI uses technology as a bridge to the real world.

> 🌱 **Built for the Touch Grass challenge:** An open-AI-powered project designed to encourage outdoor exploration, nature awareness, and meaningful offline experiences.

---

## ✨ Features

### 🔍 1. AI Nature Scanner

Upload a photo of something you discover outdoors and analyze it using an open-weight image classification model.

* Runs AI inference directly in the browser.
* Displays the top five model predictions.
* Shows confidence scores for each prediction.
* Supports common image formats, including JPG, PNG, and WEBP.
* Lets you save discoveries to your personal nature journal.
* Uses browser-side inference instead of sending images to a dedicated AI inference server.

**Note:** The initial implementation uses a general-purpose image classifier. Its predictions are not guaranteed to identify individual plant, bird, or insect species correctly.

### 🌿 2. Daily Outdoor Quests

Discover simple activities that encourage you to explore the natural world.

Examples include:

* **Meet a Leaf:** Find three different leaf shapes and compare their patterns.
* **Birdsong Break:** Spend five quiet minutes listening for bird calls.
* **Look Up:** Observe the clouds and discover interesting shapes.

Complete quests, track your activity, and build a habit of spending more time outdoors.

### 📓 3. Personal Nature Journal

Keep a collection of your outdoor experiences and AI-assisted discoveries.

* Save completed quests.
* Store AI predictions and resized discovery photos.
* Review previous journal entries.
* Remove entries whenever you want.
* Keep journal data in your browser using LocalStorage.

Your journal is designed to work without an account or a dedicated application server.

### ⏱️ 4. Outdoor Break Timer

Use the built-in ten-minute timer to remind yourself to take a break from your screen.

* Start and stop an outdoor break.
* Get a completion notification.
* Track completed timer minutes in your activity statistics.

### 📊 5. Activity Dashboard

View your progress through a simple dashboard displaying:

* Outdoor minutes recorded.
* Discoveries saved.
* Consecutive active days.

These statistics are stored locally in your browser.

### 📱 6. Responsive User Interface

EcoQuest AI uses a nature-inspired design with:

* Forest-green and sage color palettes.
* Responsive layouts for desktop and mobile.
* Interactive cards and buttons.
* A simple, accessible navigation structure.
* Clear AI loading and status messages.

---

## 🎯 Project Goals

EcoQuest AI aims to:

1. Encourage people to explore nature rather than spend unnecessary time on screens.
2. Demonstrate a practical application of open-weight AI in a frontend web application.
3. Make AI-powered exploration accessible without requiring a paid AI API.
4. Keep image inference and personal journal data on the user's device.
5. Demonstrate how open technologies can be used to build useful, privacy-conscious applications.
6. Provide a foundation for future nature-recognition and offline-AI features.

---

## 🛠️ Tech Stack

| Technology                   | Purpose                                                  |
| ---------------------------- | -------------------------------------------------------- |
| HTML5                        | Page structure and semantic content                      |
| CSS3                         | Responsive design, layouts, colors, and animations       |
| Vanilla JavaScript           | Application logic and interactive features               |
| Hugging Face Transformers.js | Running supported machine-learning models in the browser |
| MobileNetV4                  | General-purpose image classification                     |
| ONNX Runtime Web             | Browser-based model inference through Transformers.js    |
| LocalStorage                 | Saving journal entries and activity statistics           |
| JavaScript ES Modules        | Loading the AI library and organizing application code   |

### Why vanilla JavaScript?

This project deliberately avoids a frontend framework to keep the implementation lightweight, approachable, and easy to understand.

The application can be developed using standard web technologies without a Node.js application server or a Python backend.

---

## 🤖 Open-Source AI Implementation

EcoQuest AI uses [Transformers.js](https://github.com/huggingface/transformers.js), a JavaScript library that enables supported machine-learning models to run in web browsers.

### AI model

The initial implementation uses the following model repository:

**[MobileNetV4 Conv Small — ImageNet-1K ONNX](https://huggingface.co/onnx-community/mobilenetv4_conv_small.e2400_r224_in1k)**

The model performs image classification by assigning scores to categories it recognizes.

### How the AI scanner works

1. The user selects an image from their device.
2. JavaScript validates the file type and size.
3. Transformers.js loads the model and required runtime assets.
4. The browser processes the image locally.
5. The model returns the highest-scoring classification predictions.
6. The application displays the predicted labels and confidence scores.
7. The user can save the result to their nature journal.

### Inference architecture

```text
User uploads a photo
        |
        v
HTML file input
        |
        v
JavaScript validates image
        |
        v
Transformers.js
        |
        v
MobileNetV4 model
        |
        v
Browser-side inference
        |
        v
Top 5 predictions
        |
        v
Optional journal entry
        |
        v
Browser LocalStorage
```

The model and runtime are downloaded when needed. Once loaded, inference can run locally without sending the image to a dedicated AI inference server.

### Why open-weight AI?

Open-weight AI provides several benefits for this project:

* **Privacy:** Images can be analyzed locally instead of being uploaded to an AI inference service.
* **Flexibility:** The model can be replaced with another compatible model.
* **Accessibility:** The application does not require a paid, per-request AI API.
* **Experimentation:** Developers can explore different models, runtimes, and inference settings.
* **Independence:** The AI feature is not tied to a single proprietary AI API provider.

Open weights do not automatically mean that every model or its training data is fully open source. Review the individual model's license and terms before redistribution or commercial use.

---

## 🔒 Privacy and Data Handling

Privacy is an important design consideration.

### What stays on your device?

* Uploaded images are processed locally by the browser-side AI model.
* Saved discoveries and journal entries are stored in browser LocalStorage.
* Activity statistics are stored locally.
* No dedicated application backend is required by the current implementation.

### What still requires internet?

* Downloading the Transformers.js library from its CDN.
* Downloading the AI model and associated runtime assets on first use.
* Loading externally hosted fonts and decorative images.

Depending on the selected model, runtime, and browser configuration, additional network requests may occur.

**Important:** Local inference reduces the need to upload images to an AI server, but the current application is not completely offline. A fully offline version would require locally available model/runtime files, appropriate caching, and offline support for other required assets.

---

## 📁 Project Structure

```text
ecoquest-ai/
│
├── index.html       # Main application interface
├── style.css        # Visual styling and responsive layouts
├── script.js        # AI inference and application logic
├── README.md        # Project documentation
└── LICENSE          # Project license, if added
```

The project uses a simple structure so that new contributors can quickly understand and extend it.

---

## 🚀 Getting Started

Follow these steps to run EcoQuest AI locally.

### Prerequisites

You will need:

* A modern web browser.
* [Visual Studio Code](https://code.visualstudio.com/) or another code editor.
* An internet connection for the initial library and model downloads.
* A local HTTP server, such as the VS Code Live Server extension.

No dedicated backend server is required.

### Step 1: Clone the repository

Replace `YOUR_USERNAME` with your GitHub username.

```bash
git clone https://github.com/YOUR_USERNAME/ecoquest-ai.git
```

### Step 2: Open the project

```bash
cd ecoquest-ai
```

Open the folder in Visual Studio Code:

```bash
code .
```

Alternatively, open the folder manually through your editor.

### Step 3: Start a local server

If you use VS Code:

1. Install the Live Server extension.
2. Open `index.html`.
3. Click **Go Live**.
4. Open the local URL shown by the extension.

You can also use another local HTTP server.

Avoid opening the application directly through a `file://` URL because JavaScript modules and model-loading features may not work correctly in that context.

### Step 4: Try the AI scanner

1. Open the Explore section.
2. Select an image from your device.
3. Click **Analyze with open AI**.
4. Wait for the model to load and process the image.
5. Review the top five predictions.
6. Save the discovery to your journal.

The first model download may take some time depending on your connection and device.

### Step 5: Explore the remaining features

* Complete an outdoor quest.
* Start the outdoor break timer.
* Save an AI discovery.
* Open your nature journal.
* Refresh the page to verify that locally saved entries persist.

---

## 🌐 Deployment

EcoQuest AI is a static web application and can be hosted on a static website platform.

### Option 1: GitHub Pages

1. Push your project files to a GitHub repository.
2. Open the repository's **Settings**.
3. Select **Pages**.
4. Choose the appropriate deployment source and branch.
5. Save the configuration.
6. Open the published website URL after deployment finishes.

Ensure the Transformers.js CDN URL and model repository remain accessible. Test AI inference on the published site because browser capabilities and cross-origin resource requirements can differ between development and production.

### Option 2: Other static hosting

You can also deploy the application to platforms such as:

* [Netlify](https://www.netlify.com/)
* [Vercel](https://vercel.com/)
* [Cloudflare Pages](https://pages.cloudflare.com/)

These are deployment options rather than project dependencies.

---

## ⚠️ Current Limitations

EcoQuest AI is an experimental project. Its current implementation has several limitations.

### 1. General-purpose image classification

The current model recognizes general image categories. It is not a dedicated botanical or ornithological identification system.

Its predictions should not be treated as authoritative species identification.

### 2. Internet required for initial setup

The application downloads its AI library and model assets from external sources. The current implementation does not provide a complete offline installation.

### 3. Browser storage limitations

LocalStorage has limited capacity and can be cleared by the browser or user. Saved image entries may eventually exceed available storage.

### 4. Browser and hardware compatibility

Inference performance depends on the browser, available memory, hardware, and runtime support. WebGPU acceleration is not available on every device.

### 5. No automatic location-based recommendations

The current version does not automatically identify nearby parks, determine local growing conditions, or calculate location-aware wildlife information.

### 6. Activity tracking is self-reported

Outdoor minutes are based on application interactions rather than verified GPS or background activity tracking.

### 7. No account synchronization

Data is stored locally and does not automatically synchronize between devices.

---

## 🗺️ Roadmap

Planned improvements include:

* [ ] Add a plant-specific image recognition model.
* [ ] Add a bird identification mode.
* [ ] Explore open-weight vision-language models for more detailed image descriptions.
* [ ] Introduce offline caching for the AI model and application assets.
* [ ] Improve journal storage using IndexedDB.
* [ ] Add a customizable daily quest generator.
* [ ] Introduce location-aware nature recommendations with user permission.
* [ ] Add an optional map of parks and nature trails.
* [ ] Improve accessibility and keyboard navigation.
* [ ] Add model selection and model attribution in the UI.
* [ ] Add automated tests for journal and activity features.
* [ ] Conduct real-world testing on mobile devices.
* [ ] Document model performance and failure cases.

These items represent future development plans, not features that are already implemented.

---

## 🤝 Contributing

Contributions are welcome!

You can help improve EcoQuest AI by:

* Suggesting new outdoor challenges.
* Improving responsive layouts.
* Testing the application on different devices.
* Exploring compatible open-weight AI models.
* Improving offline support.
* Fixing bugs and accessibility issues.
* Improving documentation.

### Contribution workflow

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the application locally.
5. Commit and push your changes.
6. Open a pull request describing the improvement.

Example:

```bash
git checkout -b feature/plant-recognition
git add .
git commit -m "Add plant recognition support"
git push origin feature/plant-recognition
```

---

## 📜 License and Model Attribution

Before publishing the project, add a `LICENSE` file and choose a license appropriate for your own code.

The code in this repository is separate from the licenses governing third-party libraries, models, fonts, and images.

Review the relevant licenses and terms for:

* [Transformers.js](https://github.com/huggingface/transformers.js)
* [MobileNetV4 ONNX model](https://huggingface.co/onnx-community/mobilenetv4_conv_small.e2400_r224_in1k)
* Any external fonts, photographs, or other assets included in the project

Do not assume that every third-party asset uses the same license as this repository.

---

## 🌍 Why EcoQuest AI Matters

Technology should help people experience more of the world, not just consume more content on a screen.

EcoQuest AI explores how open-weight AI can make outdoor discovery more accessible while keeping inference and personal journal data on the user's device.

The project demonstrates that useful AI experiences can be built with ordinary web technologies and an interchangeable model stack, without requiring a proprietary AI API for every interaction.

The long-term goal is simple:

**Use AI to spark curiosity, then put the phone away and explore the world.**

---

## 💚 Acknowledgements

* [Hugging Face](https://huggingface.co/) for its model ecosystem and JavaScript tooling.
* The [Transformers.js contributors](https://github.com/huggingface/transformers.js) for browser-side machine-learning infrastructure.
* The contributors and maintainers of the MobileNetV4 model.
* The open-source community for making accessible AI experimentation possible.

---

**If you like the idea, consider giving the repository a ⭐ on GitHub and contributing an outdoor quest of your own.**

*Built with curiosity, vanilla JavaScript, and open-weight AI. 🌿*
