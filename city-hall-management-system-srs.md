# Software Requirements Specification
## City Hall Management System
**Version 1.0 approved**
Prepared by Chiriac Adrian, Dinca Alexia & Ghiluta Denis
Facultatea de Automatica, Calculatoare si Electronica din Craiova
27.02.2026
## Table of Contents

## Revision History

## Introduction
### Purpose
The purpose of this Software Requirements Specification (SRS) is to describe the requirements for the City Hall Management System, a client-server software application designed to support the activities of a town hall administration. The system aims to assist the mayor and city hall employees in organizing the institutional structure, communicating with citizens, and managing official documents.

### Document Conventions
The following abbreviations and conventions are used throughout this document:
SRS - Software Requirements Specification
CHMS - City Hall Management System
DB - Database used for storing application data

ORM - Object-Relational Mapping
UI - User Interface of the application
API - Application Programming Interface used for communication between components
RBAC - Role-Based Access Control system used to manage permissions
CRUD - Create, Read, Update, Delete operations
HTTPS - Secure communication protocol used for web applications

AES-256 - Advanced Encryption Standard - 256 bit

SMTP -  Simple Mail Transfer Protocol

TLS - Transport Layer Security
GDPR - General Data Protection Regulation
EU - European Union

All requirements in this document are uniquely identified using the format REQ-X.
### Intended Audience and Reading Suggestions
This document is intended for developers, testers, and project evaluators involved in the development of the system. Developers will use this document to understand the system requirements and implement the application accordingly. Testers will use it to verify that the implemented features match the specified requirements. Academic staff and project evaluators may use this document to analyze the structure and completeness of the project.
### Product Scope
The City Hall Management System is a web-based application designed to support the administrative activities of a town hall. The system will help manage the organizational structure of the institution, facilitate communication between the city hall and citizens, and handle the flow of official documents.Through this application, employees will be able to manage departments and documents, while citizens will be able to submit hearing requests and communicate with the administration.
### References
The following resources were used as references for this project:
- IEEE Software Requirements Specification Template - Karl E. Wiegers
- Course materials for the Software Engineering course
- Project specification provided by the course professor
- Documentation of the technologies used for implementation
## Overall Description
### Product Perspective
The City Hall Management System is a client-server web application designed to support administrative processes within a town hall, as well as their public relations. The system will integrate several modules responsible for managing the organizational structure, communication with citizens, and document management. All information will be stored in a centralized database and accessed through a web interface.
### Product Functions
#### The main functions of the system include:
- User authentication and role management
- Management of the city hall organizational structure
- Management of departments and employees in said departaments
- Creation, modification, and approval of requests
- Communications about request status and personalized information on e-mail
- Online communication between citizens and city hall staff through forum boards
- Generation of reports related to hearings and documents
- Document storage, search, and categorization
- Announcements published on Dashboard
### User Classes
Mayor - main administrative authority with full access to the system.
System Administrator - manages system configuration and user accounts.
Department Manager - supervises employees and departmental activities.
Employee - handles administrative tasks and document processing.
Forum Administrator - monitors forum discussions and ensures that communication remains respectful and appropriate
Citizen - external user who interacts with the City Hall through hearing requests and public information access.

### Operating Environment
The City Hall Management System will operate as a web-based application accessible through modern web browsers.
- 2.4.1. Client requirements include:
Operating System: Windows 10, Windows 11, Linux, or macOS
#### Web Browser:
Google Chrome version 110 or later
Mozilla Firefox version 110 or later
Microsoft Edge version 110 or later
Brave Browser version 1.50 or later
The system requires an active internet connection in order to communicate with the application server.
- 2.4.2. Server-side requirements include:
Operating System: Linux or Windows Server
Database Management System: Microsoft SQL Server
Backend runtime environment: .NET runtime environment (depending on the final implementation)

### Design and Implementation Constraints
The development of the City Hall Management System will follow standard software engineering practices and will use modern web development technologies.
The application will be implemented as a web-based client-server system consisting of a frontend user interface, a backend server responsible for application logic, and a relational database used for data storage.
The following development tools and technologies will be used for implementing the system:
#### Programming Languages:
TypeScript for frontend development
C# for backend development
HTML5 and CSS3 for building the user interface
#### Frameworks:
Angular for frontend development
ASP .NET Core for backend development
#### Database Management System:
Microsoft SQL Server with Entity Framework Core as the ORM
Local :  Encrypted Local Storage for Documents
Deployed: Bucket type / Azure Blobs storage for Documents
#### Development Environment:
Visual Studio Code – open-source development environment used for editing and managing source code
#### Version Control System:
Git for version control (open-source software)
GitHub platform for repository hosting and collaboration
Most of the technologies used in the development process are open-source and do not require commercial licenses. The development environments used in this project are available through free community or student licenses.
All source code developed for this project will follow coding standards and best practices defined in the Software Quality Attributes section of this document.

### User Documentation
The final version of the City Hall Management System will include several documents and resources intended to help users and administrators understand and operate the system.
#### The project deliverables will include:
- Software Requirements Specification (SRS) document describing the system requirements
- Architecture documentation including system diagrams and database models
- Source code repository hosted on GitHub and an archived version of the project
- Quick Guide explaining how the application can be used by different categories of users
## External Interface Requirements
### User Interfaces
#### Dashboard for Citizens:

#### Dashboard for Administrator:

#### Log In and Sign Up Pages:

#### Home Page:

### Hardware Interface
N/A
### Software Interfaces
CreateUser()
AssignRoletoUser()
LoginUser()
LogoutUser()
CreateRequest()
UploadAndAttachDocumentToRequest()
JoinForum()
AddCommentToForumThread()
ChangeRequestStatus()
SendEmailToUser()
AssignDepartamentForRequest()

### Communications Interfaces
HTTPS — Secure Hypertext Transfer Protocol for Encrypted Web Communication
TLS — Transport Layer Security Cryptographic Communication Protocol
SMTP — Simple Mail Transfer Protocol for Electronic Message Transmission

## System Features
### User Account & Access Management
- 4.1.1 Description and Priority
This feature allows users to register, authenticate, and manage their accounts within the system. It ensures controlled access to the platform and enables users to maintain their personal profile information and credentials.
Priority: High
- 4.1.2 Stimulus/Response Sequences
The user accesses the login or registration page.
The user enters registration data or authentication credentials.
The system validates the provided information.
If the data is valid, the system creates the account or grants access to the user dashboard.
If the data is invalid, the system displays an error message.
- 4.1.3 Functional Requirements

- REQ-1: The system shall support user registration.
- REQ-2: The system shall support user authentication.
- REQ-3: The system shall support user logout.
- REQ-4: The system shall support password reset via email.
- REQ-5: The system shall allow authenticated users to change their password.
- REQ-6: The system shall allow users to view their profile information.
- REQ-7: The system shall allow users to edit their profile information.
- REQ-8: The system shall support role-based access control.
- REQ-9: The system shall assign roles to users.
- REQ-10: The system shall restrict access to functionalities based on user roles.
### Organizational Structure Management
- 4.2.1 Description and Priority
This feature allows administrators to manage the internal organizational structure of the city hall, including departments, employees, and hierarchical relationships. It supports the creation and maintenance of an up-to-date organizational chart.
Priority: High
- 4.2.2 Stimulus/Response Sequences
The administrator accesses the organizational structure management module.
The administrator creates, edits, or deletes departments and employee records.
The administrator assigns employees to departments and defines hierarchical relationships.
The system validates the entered data and updates the organizational chart.
The updated structure is displayed and stored in the system.

- 4.2.3 Functional Requirements

- REQ-11: The system shall allow administrators to create departments.
- REQ-12: The system shall allow administrators to edit departments.
- REQ-13: The system shall allow administrators to delete departments.
- REQ-14: The system shall allow administrators to add employees.
- REQ-15: The system shall allow administrators to edit employee information.
- REQ-16: The system shall allow administrators to delete employees.
- REQ-17: The system shall allow administrators to assign employees to departments.
- REQ-18: The system shall display the organizational chart.
- REQ-19: The system shall allow administrators to define hierarchical relationships between departments.
- REQ-20: The system shall allow saving and updating the organizational chart structure.

### Document Management
- 4.3.1 Description and Priority
This feature allows users and administrators to manage documents within the system. It supports uploading, viewing, downloading, categorizing, archiving, and searching documents in order to ensure efficient document storage and retrieval.
Priority: High
- 4.3.2 Stimulus/Response Sequences
The user accesses the document management module.
The user uploads, searches, previews, downloads, or categorizes a document.
The system validates the action and processes the document request.
The system stores or retrieves the document information.
The requested document or result is displayed to the user.
- 4.3.3 Functional Requirements

- REQ-21: The system shall allow users to upload documents.
- REQ-22: The system shall allow users to download documents.
- REQ-23: The system shall allow users to preview documents.
- REQ-24: The system shall allow users to categorize documents.
- REQ-25: The system shall allow users to search documents by name.
- REQ-26: The system shall allow users to search documents by category.
- REQ-27: The system shall allow users to search documents by owner.
- REQ-28: The system shall allow administrators to archive documents.
- REQ-29: The system shall restrict access to documents based on user role.
- REQ-30: The system shall allow users to print documents.

### Citizen Request Management
- 4.4.1 Description and Priority
This feature allows citizens to submit and monitor requests addressed to the city hall. It also allows administrators to review, process, and respond to submitted requests in an organized manner.
Priority: High
- 4.4.2 Stimulus/Response Sequences
The citizen logs into the system.
The citizen completes and submits a request form.
The system validates and stores the request.
The administrator reviews the request and updates its status.
The citizen can later view the request status and any response provided.
- 4.4.3 Functional Requirements

- REQ-31: The system shall allow citizens to submit requests.
- REQ-32: The system shall allow citizens to edit submitted requests before processing.
- REQ-33: The system shall allow citizens to cancel submitted requests.
- REQ-34: The system shall allow administrators to review requests.
- REQ-35: The system shall allow administrators to update request status.
- REQ-36: The system shall allow citizens to view request status.
- REQ-37: The system shall allow citizens to attach documents to requests.
- REQ-38: The system shall allow administrators to respond to requests.
- REQ-39: The system shall maintain request history.
- REQ-40: The system shall notify citizens on e-mail when status or comments have been modified.

### Announcements & Dashboard
- REQ-41: The system shall allow authorized users to publish announcements.
- REQ-42: The system shall allow authorized users to edit announcements.
- REQ-43: The system shall allow authorized users to delete announcements.
- REQ-44: The system shall allow users to view announcements.
- REQ-45: The system shall allow users to filter announcements.
- REQ-46: The system shall send email notifications for important announcements.
- REQ-47: The system shall allow users to generate a link to share announcements.
- REQ-48: The system shall display dashboard statistics.
- REQ-49: The system shall display recent announcements on the dashboard.
- REQ-50: The user shall be able to choose between a predefined set of dashboard layouts.

### Forum Communication Module
- REQ-51: The system shall allow users to create forum threads.
- REQ-52: The system shall allow users to edit their own forum threads.
- REQ-53: The system shall allow users to delete their own forum threads.
- REQ-54: The system shall allow users to post comments in forum threads.
- REQ-55: The system shall allow users to edit their own comments.
- REQ-56: The system shall allow users to delete their own comments.
- REQ-57: The system shall allow forum administrators to moderate forum threads.
- REQ-58: The system shall allow forum administrators to delete inappropriate content.
- REQ-59: The system shall allow users to view forum discussions.
- REQ-60: The system shall allow users to search forum discussions.

### Validation & Usability Support
- REQ-61: The system shall validate user input in forms.
- REQ-62: The system shall display error messages for invalid input.
- REQ-63: The system shall provide confirmation messages for successful operations.
- REQ-64: The system shall support search functionality across modules.
- REQ-65: The system shall allow users to access help or support information.

### Advanced Document Workflow
- REQ-66: The system shall allow administrators to approve uploaded documents.
- REQ-67: The system shall allow administrators to reject uploaded documents.
- REQ-68: The system shall allow users to view document approval status.
- REQ-69: The system shall allow administrators to assign documents to departments.
- REQ-70: The system shall allow users to receive notifications when documents are approved or rejected.

### Public Transparency Features
- REQ-71: The system shall allow users to view public institutional information.
- REQ-72: The system shall allow administrators to publish public documents.
- REQ-73: The system shall allow users to download public documents without authentication.

### Chatbot for frequently asked questions
- REQ-74: The system shall provide a chatbot interface accessible from the dashboard for all user types.
REQ-75: The system shall allow users to interact with the chatbot by selecting predefined frequently asked questions.
REQ-76: The system shall display predefined responses related to city hall services, procedures, and public information.
REQ-77: The system shall allow administrators to manage and update the chatbot knowledge base.
REQ-78: The system shall allow the chatbot to suggest relevant documents or announcements based on user queries.
REQ-79: The system shall allow users to restart or close the chatbot interaction session.
REQ-80: The system shall log chatbot interactions for system improvement and administrative review.
## Other Nonfunctional Requirements
### Performance Requirements
The system shall meet the following performance criteria:
- PR-1: The system shall load any dashboard page within a maximum of 3 seconds under normal load conditions.
 PR-2: The system shall support at least 100 concurrent active users without performance degradation.
 PR-3: The system shall process document upload requests within a maximum of 5 seconds for files up to 10 MB.
 PR-4: The system shall return search results within 2 seconds for typical database queries.
 PR-5: The system shall send system notifications within 10 seconds after the triggering event.
 PR-6: The system shall maintain 99% system availability during operational hours.
### Safety Requirements
N/A
### Security Requirements
- SR-1: User logs in with email address and password.

 SR-2: Password is stored hashed in the database, in base64.
- SR-3: User authentication is handled via Cookie-based Session Management. When a user logs in, the ASP.NET Core middleware generates an encrypted authentication cookie. This cookie is sent with every subsequent HTTP request, allowing the server to identify the user and verify their permissions. Security is enforced through AES-256 encryption of the cookie payload.

SR-3: All of the emails will be sent using SMTP and encrypted using TLS 1.2

SR-4: All of the documents will be stored encrypted and either the managed Identity (on Azure) or the app itself (locally) will be responsible to check against authentication state and identify if the respective user has access to said document.

SR-5: The app, apart from using authentication state, will also use Role Based Access Control in order to give permission or block access to different pages, documents, functionalities on some pages.
### Software Quality Attributes
To ensure maintainability, security, and scalability of the City Hall Management System, the following concrete coding rules shall be applied during development:
- 5.4.1 Backend code (.NET) shall follow the official Microsoft C# Coding Conventions (PascalCase for classes, camelCase for local variables).
- 5.4.2 All database operations shall be implemented exclusively using Entity Framework ORM, without hardcoded SQL queries in controllers.
5.4.3 User input validation shall be implemented on both frontend and backend levels.
- 5.4.5 Passwords and sensitive data shall never be stored in plain text and must be encrypted using secure hashing algorithms.
- 5.4.6 All API endpoints shall include exception handling mechanisms (try-catch and logging).
- 5.4.7 Frontend code shall be modular, using reusable components for dashboard, chat, and document management interfaces.
- 5.4.8 Direct database access from the user interface layer shall be strictly prohibited.
- 5.4.9 All communication between client and server shall be performed exclusively over HTTPS using TLS encryption to ensure data confidentiality and integrity.
- 5.4.10 The system shall enforce Role-Based Access Control (RBAC) consistently across all modules, ensuring that authorization checks are centralized and reusable.
- 5.4.11 The application shall be designed using layered architecture principles (Presentation Layer, Business Logic Layer, Data Access Layer) to improve maintainability and scalability.
- 5.4.12 All critical system actions (authentication, document operations, request status changes) shall be logged to support auditing and system monitoring.
- 5.4.13 The system shall implement modular service design on the backend to allow independent testing and future integration with external governmental systems.
- 5.4.14 The frontend user interface shall follow responsive design principles to ensure usability across different screen resolutions and supported browsers.
- 5.4.15 The system shall support graceful error handling by displaying user-friendly error messages without exposing internal implementation details.
- 5.4.16 All long-running operations (document upload, report generation) shall be implemented using asynchronous programming techniques to maintain system responsiveness.
- 5.4.17 The database schema shall be normalized to at least Third Normal Form (3NF) to ensure data consistency and minimize redundancy.
- 5.4.18 The system shall ensure high availability through proper resource management and optimized query execution strategies.
- 5.4.19 Source code shall be version-controlled using Git and follow collaborative development practices including meaningful commit messages and branch management.
- 5.4.20 The application shall be designed with extensibility in mind, allowing future addition of modules such as digital signatures, payment services, and mobile access without major architectural refactoring.

### Business Rules
- 5.5.1. User Account and Authentication Rules
	5.5.1.1.  A user must register with a unique email address
	5.5.1.2. Password must contain at least 8 characters, a Capital and lowercase letter and a digit
           5.5.1.3.  In order for the account to be activated, an email verification must be done
	5.5.1.4. After 5 failed login attempts, the user should receive a temporary timeout.
	5.5.1.5. If the user chooses to do so, 2FA authentication will be enabled, a code will be sent on email that will expire in 5 minutes.
	5.5.1.6. Sessions will expire if no other calls to the server are made in a 30 minute time window.

5.5.2. Authorization and Role Rules
	5.5.2.1. Guests will only be able to access public announcements
	5.5.2.2. Registered users with role Citizen will be able to access dashboard, open requests, and specific forums they have signed up for.
	5.5.2.3. Forum administrators can delete forum posts they deem as inappropriate.

5.5.3. GDPR and Personal Data Protection Rules
	5.5.3.1. Personal data processing must comply with GDPR (Regulation EU 2016/679)
	5.5.3.2. Personal data processing must comply with Romanian Law 190/2018
	5.5.3.3. Citizens must be able to request a copy of all of their data stored in the app.
	5.5.3.4. Citizens must be able to request deletion (where legally applicable)
## Other Requirements
The City Hall Management System shall include additional requirements related to data storage, localization, legal compliance, and system scalability.
The system database shall store organizational structure data, citizen requests, communication records, and official documents in a structured and secure format. The application shall support future integration with external governmental systems such as national registries or document validation services.
The system shall support English as the primary language, with the possibility of adding additional languages in future versions. All legal requirements regarding data protection and electronic communication within public administration shall be respected.
The software shall be designed with modular architecture to allow future extension of functionalities such as payment services, digital signatures, or mobile access.
## Appendix A: Glossary
SRS – Software Requirements Specification
CHMS – City Hall Management System
Administrator – Authorized city hall employee with system management rights
Citizen – Registered user who interacts with the city hall services
Department – Organizational unit within the city hall
Document Workflow – Process of creating, reviewing, approving, and archiving official documents
Authentication – Process of verifying user identity
Authorization – Process of granting access based on user role
Audit Log – Record of system actions performed by users
## Appendix B: Analysis Models
The system analysis includes the following conceptual models:
Use Case Diagram illustrating interactions between citizens, employees, and administrators.
Class Diagram representing core entities such as User, Department, Document, Hearing, and Message.
Entity-Relationship Diagram describing database structure and relationships.
Data Flow Diagram showing the movement of information between system modules.
These models are provided in the project documentation and support the system design and implementation phases.

## Appendix C: To Be Determined List
- TBD-1: Final selection of database server technology version.
- TBD-2: Integration requirements with external governmental platforms.
- TBD-3: Final decision regarding digital signature implementation.
- TBD-4: Maximum number of concurrent users supported by the system.
- TBD-5: Exact document storage capacity requirements.