# Repyter

A Jupyter Notebook Protoype in React

## Project Structure

The project is organized into several core components:

```
src/
|-- components/
| |-- FileList.tsx
| |-- FileEditor.tsx
| |-- CodeCell.tsx
|-- pages/
| |-- Notebook.tsx
|-- hooks/
| |-- useNotebook.ts  # Zustand Store and helper hooks
|-- services/
| |-- api.ts          # Backend Helpers
|-- App.tsx
|-- main.tsx
```

## Installation and Setup

This project makes use of JupyterHub as the backend, so it requires JupyterHub.

- JupyterHub Setup

  1.  Run JupyterHub via Docker Compose

          ```
          git clone https://github.com/jupyterhub/jupyterhub-deploy-docker.git
          cd jupyterhub-deploy-docker/basic-example
          docker-compose up
          ```

  2.  Access JupyterHub

  - Open your browser and navigate to: http://localhost:8000/hub/signup
  - Create an admin user with the following credentials: make sure username remain admin

- Repyter Setup
  ```
  yarn
  yarn dev
  ```
