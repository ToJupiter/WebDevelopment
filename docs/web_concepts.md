### 1. Core Web Fundamentals

*   **Internet:** The global physical network of computers that use TCP/IP protocols to share information. It is distinct from the World Wide Web.
*   **World Wide Web (WWW):** A collection of interlinked multimedia documents (web pages) stored on the Internet and accessed using HTTP.
*   **HTTP/HTTPS (Hypertext Transfer Protocol/Secure):** The foundational protocol for communication between web clients (browsers) and servers.
    *   **HTTP:** A stateless, request-response protocol.
    *   **HTTPS:** The secure version of HTTP, using SSL/TLS to encrypt data.
*   **URL/URI (Uniform Resource Locator/Identifier):** The address used to access a resource on the web. A URL is a type of URI that specifies the location.
*   **Web Browser:** Software that acts as a web client. Its primary tasks are to convert URLs into HTTP requests, communicate with servers, and render the returned documents.
*   **Web Server:** Software (e.g., Apache, Nginx, IIS) that receives HTTP requests, maps them to resources (files or programs), and returns HTTP responses.

### 2. Front-End Technologies (Client-Side)

*   **HTML (HyperText Markup Language):** The standard language for creating the structure and content of web pages.
    *   **HTML5:** The latest version, introducing new semantic tags (`<header>`, `<nav>`, `<article>`, `<section>`, `<footer>`), media elements (`<audio>`, `<video>`), graphics (`<canvas>`, `<svg>`), and new form input types.
*   **CSS (Cascading Style Sheets):** The language used to control the presentation and layout of web pages, separating content from design.
    *   **Basic CSS:** Selectors, color, text, box model, layout.
    *   **Advanced CSS:** Positioning, overlap (z-index), rounded corners, gradients, shadows, transitions, animations.
    *   **Responsive Web Design (RWD):** Techniques (like media queries and flexible grids) to make web pages render well on a variety of devices and screen sizes.
*   **JavaScript:** A programming language that enables dynamic and interactive behavior on web pages.
    *   **Core Language:** Data types, variables (`var`, `let`, `const`), operators, control statements, functions, objects, arrays, classes.
    *   **Built-in Objects:** `String`, `Math`, `Date`, `Array`.
    *   **Document Object Model (DOM):** A programming interface for HTML and XML documents. It represents the page as a tree of objects, allowing JavaScript to dynamically change the document's structure, style, and content.
    *   **Browser Object Model (BOM):** Allows JavaScript to interact with the browser itself (e.g., `window`, `navigator`, `screen`, `location`, `history`).
*   **Asynchronous JavaScript:**
    *   **AJAX (Asynchronous JavaScript and XML):** A technique to send and receive data from a server asynchronously without reloading the entire page, using the `XMLHttpRequest` object.
    *   **Fetch API:** A modern, promise-based replacement for `XMLHttpRequest`.

### 3. Front-End Libraries & Frameworks

*   **React:** A free and open-source front-end JavaScript library for building user interfaces based on components.
    *   **JSX:** A syntax extension that allows writing HTML-like code within JavaScript.
    *   **Core Concepts:** Components, state, props, lifecycle methods, event handling.

### 4. Back-End Technologies (Server-Side)

*   **Node.js:** A JavaScript runtime environment that allows executing JavaScript code on the server-side, outside of a browser. It is built on Chrome's V8 engine and uses an event-driven, non-blocking I/O model.
*   **Express.js:** A minimal and flexible web application framework for Node.js, used for building web applications and APIs.
    *   **Core Concepts:** Routing, middleware, handling HTTP requests and responses.

### 5. Protocols & APIs

*   **WebSockets:** A communication protocol providing full-duplex, persistent communication channels over a single TCP connection, enabling real-time data exchange between client and server.
*   **Server-Sent Events (SSE):** A technology where a browser receives automatic updates from a server via an HTTP connection, a one-way real-time communication from server to client.
*   **WebRTC (Web Real-Time Communication):** A collection of standards and APIs that enables direct peer-to-peer communication for audio, video, and data in web pages without plugins.
*   **Web Storage API:**
    *   **Local Storage:** Stores data with no expiration date.
    *   **Session Storage:** Stores data for one session (until the browser tab is closed).
*   **IndexedDB:** A low-level API for client-side storage of significant amounts of structured data.

### 6. Data & Databases

*   **SQL Databases:** Relational databases like PostgreSQL, MySQL, MariaDB, MS SQL.
*   **NoSQL Databases:** Non-relational databases like MongoDB, InfluxDB.

### 7. Development & Operations (DevOps)

*   **Version Control:**
    *   **Git:** A distributed version control system for tracking changes in source code.
    *   **GitHub / GitLab / Bitbucket:** Web-based hosting services for Git repositories.
*   **Containerization:**
    *   **Docker:** A platform for developing, shipping, and running applications in isolated environments called containers.
        *   **Dockerfile:** A script containing commands to build a Docker image.
        *   **Image:** A read-only template used to create containers.
        *   **Container:** A runnable instance of an image.
*   **Orchestration:**
    *   **Kubernetes (K8s):** An open-source system for automating deployment, scaling, and management of containerized applications.
        *   **Core Concepts:** Pods, ReplicaSets, Services, Deployments.
*   **CI/CD (Continuous Integration/Continuous Deployment):** A method to frequently deliver applications by introducing automation into the stages of app development.
*   **Cloud Computing:** On-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user.
    *   **DigitalOcean:** An example of a cloud infrastructure provider.

### 8. Architecture & Models

*   **Client-Server Model:** A distributed application structure that partitions tasks or workloads between service providers (servers) and service requesters (clients).
*   **3-Tier Architecture:** An architecture separating an application into three logical and physical computing tiers: Presentation, Business Logic, and Data Access tiers.
*   **MVC (Model-View-Controller):** A software design pattern for implementing user interfaces, dividing the related program logic into three interconnected elements.
*   **Single-Page Application (SPA) vs. Multi-Page Application (MPA):**
    *   **SPA:** A web application that interacts with the user by dynamically rewriting the current page rather than loading entire new pages from the server.
    *   **MPA:** A traditional web application that loads entirely new pages from the server upon user interaction.

### 9. Web Security

*   **General Concepts:** Vulnerabilities, active vs. passive attacks.
*   **HTTPS & SSL/TLS:** Securing communication between client and server.
*   **Same-Origin Policy (SOP):** A critical security mechanism that restricts how a document or script from one origin can interact with a resource from another origin.
*   **CORS (Cross-Origin Resource Sharing):** A mechanism that uses additional HTTP headers to tell a browser to let a web application running at one origin have permission to access selected resources from a server at a different origin.
*   **Common Attacks & Mitigations:**
    *   **Clickjacking:** Tricking a user into clicking something different from what they perceive.
    *   **XSS (Cross-Site Scripting):** Injecting malicious scripts into content from otherwise trusted websites.
    *   **SQL Injection:** Inserting or "injecting" a malicious SQL query via the input data from the client to the application.

### 10. State Management

*   **Hidden Form Fields:** Passing data between forms using non-displayed input fields.
*   **Cookies:** Small pieces of data stored on the client-side by the web browser.
*   **Sessions (e.g., PHP Sessions):** A way to store information (in variables) to be used across multiple pages for a single user.