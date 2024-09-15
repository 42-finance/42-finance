<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<br />
<div align="center">
  <a href="https://github.com/42-finance/42-finance">
    <img src="assets/logo.png" alt="Logo" width="120" height="120">
  </a>

<h3 align="center">42 Finance</h3>

  <p align="center">
    42 Finance is a financial tracking and budgeting app that allows you to link your accounts from financial institutions and track your income, expenses and account transfers.
    <br />
    <br />
    <a href="https://42f.io">Web App</a>
    ·
    <a href="https://apps.apple.com/us/app/42finance/id6498875911">App Store</a>
    ·
    <a href="https://play.google.com/store/apps/details?id=com.fortytwofinance.app">Google Play</a>
    ·
    <a href="https://www.reddit.com/r/42finance">Reddit</a>
    ·
    <a href="https://discord.gg/5v2qNeSyyx">Discord</a>
    <br />
    <br />
    <a href="https://github.com/42-finance/42-finance/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/42-finance/42-finance/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

## About The Project

### Built With

- [![ReactNative][ReactNative]][ReactNative-url]
- [![React][React]][React-url]
- [![Vite][Vite]][Vite-url]
- [![Tailwind][Tailwind]][Tailwind-url]
- [![Node][Node]][Node-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

1. Install the latest version of Node.js. https://nodejs.org/en
2. Install yarn
   ```sh
   npm install -g yarn
   ```
3. Install PostgreSQL https://www.postgresql.org/

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/42-finance/42-finance.git
   ```
2. Install packages
   ```sh
   yarn install
   ```

### Environment Setup

1. Create a copy of `apps/api/.env-example` and rename it to `.env`. Fill out each variable with your own values.
2. Create a copy of `apps/mobile/.env-example` and rename it to `.env`. Fill out each variable with your own values.
3. Create a copy of `apps/frontend/.env-example` and rename it to `.env`. Fill out each variable with your own values.
4. Create a copy of `libs/database/.env-example` and rename it to `.env`. Fill out each variable with your own values.

### Database Setup

1. Create a new postgres database or you can use the default database named `postgres` that is created during installation.
2. Run the database migrations.
   ```sh
   yarn workspace database migrate:up
   ```

### Startup

1. Start the API.
   ```sh
   yarn workspace api start
   ```
2. Start the mobile app.
   ```sh
   yarn workspace mobile start
   ```
3. Start the frontend.
   ```sh
   yarn workspace frontend start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

If you want to contribute to the project please follow the steps below to fork the repository and create a pull request. You can also create an issue with the tag "enhancement" or "bug" for any feature requests or bug reports.

1. Fork the project
2. Create your feature branch (`git checkout -b feature`)
3. Commit your changes (`git commit -m 'Added some new features'`)
4. Push to the branch (`git push origin feature`)
5. Open a pull request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/42-finance/42-finance/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=42-finance/42-finance" alt="contrib.rocks image" />
</a>

## Contact

Jeff Swarts - jeff@42f.io

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/42-finance/42-finance.svg?style=for-the-badge
[contributors-url]: https://github.com/42-finance/42-finance/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/42-finance/42-finance.svg?style=for-the-badge
[forks-url]: https://github.com/42-finance/42-finance/network/members
[stars-shield]: https://img.shields.io/github/stars/42-finance/42-finance.svg?style=for-the-badge
[stars-url]: https://github.com/42-finance/42-finance/stargazers
[issues-shield]: https://img.shields.io/github/issues/42-finance/42-finance.svg?style=for-the-badge
[issues-url]: https://github.com/42-finance/42-finance/issues
[ReactNative]: https://img.shields.io/badge/ReactNative-20232A?style=for-the-badge&logo=React&logoColor=61DAFB
[ReactNative-url]: https://reactnative.dev/
[React]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[Node]: https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white
[Node-url]: https://nodejs.org/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Tailwind]: https://img.shields.io/badge/Tailwind_CSS-grey?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC
[Tailwind-url]: https://tailwindcss.com/
