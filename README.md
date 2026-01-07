<div align= "center">
<hr>
</div>

<div align="center">
<a href="https://github.com/ausdotsn50/alzar" target="blank">
<img src="mobile/assets/images/waterDispenserBottle.png" width="150" alt="Logo" />
</a>

<h2> Alzar </h2>

[![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=fff)](#)
[![SQLite](https://img.shields.io/badge/SQLite-%2307405e.svg?logo=sqlite&logoColor=white)](#)

</div>

## 💡 Overview
Alzar is a dedicated mobile Point of Sale (POS) application designed to streamline the daily operations of water refilling station businesses. It focuses on easy order logging and management, providing business owners with an immediate overview of their daily performance. It's design is based on the known operation of water refilling stations businesses in the developer's local - Allen, Northern Samar.

Originally developed as an iOS-cloud-sync app. However, having not been pushed in Apple Store or TestFlight, Alzar has been refactored to use local storage (SQLite) giving water station managers full control of their data in their local phones

## ✨ Features
- **Business Dashboard:** Real-time summary of today’s revenue, top contributors, and delivery vs. walk-in counts.

- **Order Management:** Chronological logging of the 50 most recent orders with quick-delete functionality.

- **Product Catalog:** Manage your water product offerings with full Create, Read, Update, and Delete (CRUD) capabilities.

- **Customer Directory:** Maintain a database of registered customers for faster transaction processing.

- **Offline First:** Powered by SQLite, allowing the app to function perfectly without an active internet connection.

- **Responsive Mobile UI:** Optimized for mobile devices using React Native and Expo.

## 📖 Sources and Acknowledgements

* **Application Inspiration:** [Wallet – Expense Tracker by Codesistency](https://www.youtube.com/watch?v=vk13GJi4Vd0)
* **Image Assets:** UI assets generated via ChatGPT.
* **AI Collaboration:** Utilized Gemini 3 and Claude 4.5 Sonnet for codebase refactoring and migration from cloud-based to on-device SQLite storage.

## 📦 Getting Started
To get a local copy of this project up and running on your emulator or device, follow these steps.

### 🚀 Prerequisites

* **Development Environment:** Any Android/iOS Emulator
* **Physical Device Testing:** [Expo Go](https://expo.dev/go) app installed on your mobile device (optional).
* **Package Manager:** [Node.js](https://nodejs.org/) and npm installed on your machine.

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ausdotsn50/alzar.git
cd mobile
```


2. **Install dependencies:**
```bash
npm install
```


3. **Start the development server:**
```bash
npx expo start
```

4. **Run on Emulator:**
Press **`a`** in the terminal to open the project on an Android Emulator, or **`i`** to run on an iOS Simulator. Alternatively, scan the QR code with the Expo Go app. **Note:** Your physical device must be connected to the same Wi-Fi network as your development server for the app to load.

## 🤝 Contributing

Contributions are welcome to help make Alzar better for water refilling station businesses.

1. **Fork the repository.**
2. **Create a new branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`).
4. **Push to the branch** (`git push origin feature/AmazingFeature`).
5. **Open a pull request**.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.