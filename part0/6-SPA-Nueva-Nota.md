```mermaid
sequenceDiagram
    participant browser
    participant server
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server->>browser: 201 Created
    deactivate server

    Note right of browser: The JS code injects dynamically the new note into the DOM, so the browser doesn't send GET requests
